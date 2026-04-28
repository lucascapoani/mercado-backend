import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from './pedido.entity';
import { ItemPedido } from './item-pedido.entity';
import { AtualizarStatusDto, CreatePedidoDto } from './pedido.dto';
import { StatusPedido } from './status-pedido.enum';
import { ClientesService } from '../clientes/clientes.service';
import { ProdutosService } from '../produtos/produtos.service';

// Transições de status permitidas
const TRANSICOES_VALIDAS: Record<StatusPedido, StatusPedido[]> = {
  [StatusPedido.ABERTO]: [StatusPedido.CONFIRMADO, StatusPedido.CANCELADO],
  [StatusPedido.CONFIRMADO]: [StatusPedido.ENTREGUE, StatusPedido.CANCELADO],
  [StatusPedido.ENTREGUE]: [],
  [StatusPedido.CANCELADO]: [],
};

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
    @InjectRepository(ItemPedido)
    private readonly itemPedidoRepository: Repository<ItemPedido>,
    private readonly clientesService: ClientesService,
    private readonly produtosService: ProdutosService,
  ) {}

  async findAll(): Promise<Pedido[]> {
    return this.pedidoRepository.find({
      relations: ['cliente', 'itens', 'itens.produto'],
      order: { criadoEm: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Pedido> {
    const pedido = await this.pedidoRepository.findOne({
      where: { id },
      relations: ['cliente', 'itens', 'itens.produto'],
    });
    if (!pedido) {
      throw new NotFoundException(`Pedido #${id} não encontrado`);
    }
    return pedido;
  }

  async findByCliente(clienteId: number): Promise<Pedido[]> {
    await this.clientesService.findOne(clienteId);
    return this.pedidoRepository.find({
      where: { clienteId },
      relations: ['itens', 'itens.produto'],
      order: { criadoEm: 'DESC' },
    });
  }

  async create(dto: CreatePedidoDto): Promise<Pedido> {
    // Valida o cliente
    await this.clientesService.findOne(dto.clienteId);

    // Valida todos os produtos e verifica estoque antes de qualquer alteração
    const produtosMap: Record<number, Awaited<ReturnType<ProdutosService['findOne']>>> = {};
    for (const itemDto of dto.itens) {
      const produto = await this.produtosService.findOne(itemDto.produtoId);
      if (!produto.ativo) {
        throw new BadRequestException(
          `Produto "${produto.nome}" está inativo e não pode ser adicionado ao pedido`,
        );
      }
      if (produto.estoque < itemDto.quantidade) {
        throw new BadRequestException(
          `Estoque insuficiente para "${produto.nome}". Disponível: ${produto.estoque}`,
        );
      }
      produtosMap[produto.id] = produto;
    }

    // Cria o pedido
    const pedido = this.pedidoRepository.create({
      clienteId: dto.clienteId,
      status: StatusPedido.ABERTO,
      observacao: dto.observacao,
      total: 0,
    });
    const pedidoSalvo = await this.pedidoRepository.save(pedido);

    // Cria os itens e debita estoque
    let total = 0;
    const itens: ItemPedido[] = [];
    for (const itemDto of dto.itens) {
      const produto = produtosMap[itemDto.produtoId];
      const subtotal = Number(produto.preco) * itemDto.quantidade;
      total += subtotal;

      const item = this.itemPedidoRepository.create({
        pedidoId: pedidoSalvo.id,
        produtoId: produto.id,
        quantidade: itemDto.quantidade,
        precoUnitario: produto.preco,
        subtotal,
      });
      itens.push(await this.itemPedidoRepository.save(item));

      // Debita estoque
      await this.produtosService.atualizarEstoque(produto.id, {
        quantidade: -itemDto.quantidade,
      });
    }

    // Atualiza o total do pedido
    pedidoSalvo.total = total;
    await this.pedidoRepository.save(pedidoSalvo);

    return this.findOne(pedidoSalvo.id);
  }

  async atualizarStatus(
    id: number,
    dto: AtualizarStatusDto,
  ): Promise<Pedido> {
    const pedido = await this.findOne(id);
    const transicoesPermitidas = TRANSICOES_VALIDAS[pedido.status];

    if (!transicoesPermitidas.includes(dto.status)) {
      throw new BadRequestException(
        `Não é possível mudar o status de "${pedido.status}" para "${dto.status}". ` +
          `Transições permitidas: ${transicoesPermitidas.length ? transicoesPermitidas.join(', ') : 'nenhuma'}`,
      );
    }

    // Ao cancelar, devolve estoque
    if (dto.status === StatusPedido.CANCELADO) {
      for (const item of pedido.itens) {
        await this.produtosService.atualizarEstoque(item.produtoId, {
          quantidade: item.quantidade,
        });
      }
    }

    pedido.status = dto.status;
    return this.pedidoRepository.save(pedido);
  }
}
