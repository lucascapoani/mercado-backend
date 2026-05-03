import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produto } from './produto.entity';
import {
  AtualizarEstoqueDto,
  CreateProdutoDto,
  UpdateProdutoDto,
} from './produto.dto';
import { CategoriasService } from '../categorias/categorias.service';

@Injectable()
export class ProdutosService {
  constructor(
    @InjectRepository(Produto)
    private readonly produtoRepository: Repository<Produto>,
    private readonly categoriasService: CategoriasService,
  ) {}

  async findAll(apenasAtivos = false): Promise<Produto[]> {
    console.log('Buscando produtos no banco de dados...');
    const where = apenasAtivos ? { ativo: true } : {};
    return this.produtoRepository.find({
      where,
      relations: ['categoria'],
      order: { nome: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Produto> {
    const produto = await this.produtoRepository.findOne({
      where: { id },
      relations: ['categoria'],
    });
    if (!produto) {
      throw new NotFoundException(`Produto #${id} não encontrado`);
    }
    return produto;
  }

  async create(dto: CreateProdutoDto): Promise<Produto> {
    // Valida se a categoria existe
    await this.categoriasService.findOne(dto.categoriaId);
    const produto = this.produtoRepository.create({
      ...dto,
      estoque: dto.estoque ?? 0,
      ativo: dto.ativo ?? true,
    });
    return this.produtoRepository.save(produto);
  }

  async update(id: number, dto: UpdateProdutoDto): Promise<Produto> {
    const produto = await this.findOne(id);
    if (dto.categoriaId) {
      await this.categoriasService.findOne(dto.categoriaId);
    }
    Object.assign(produto, dto);
    return this.produtoRepository.save(produto);
  }

  async atualizarEstoque(
    id: number,
    dto: AtualizarEstoqueDto,
  ): Promise<Produto> {
    const produto = await this.findOne(id);
    const novoEstoque = produto.estoque + dto.quantidade;
    if (novoEstoque < 0) {
      throw new BadRequestException(
        `Estoque insuficiente. Estoque atual: ${produto.estoque}`,
      );
    }
    produto.estoque = novoEstoque;
    return this.produtoRepository.save(produto);
  }

  async remove(id: number): Promise<void> {
    const produto = await this.produtoRepository.findOne({
      where: { id },
      relations: ['itensPedido'],
    });
    if (!produto) {
      throw new NotFoundException(`Produto #${id} não encontrado`);
    }
    if (produto.itensPedido && produto.itensPedido.length > 0) {
      throw new BadRequestException(
        `Não é possível remover o produto "${produto.nome}" pois ele está presente em ${produto.itensPedido.length} pedido(s)`,
      );
    }
    await this.produtoRepository.remove(produto);
  }
}
