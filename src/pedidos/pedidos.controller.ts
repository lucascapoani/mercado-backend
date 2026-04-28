import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PedidosService } from './pedidos.service';
import { AtualizarStatusDto, CreatePedidoDto } from './pedido.dto';
import { Pedido } from './pedido.entity';

@ApiTags('Pedidos')
@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os pedidos' })
  findAll(): Promise<Pedido[]> {
    return this.pedidosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar pedido por ID' })
  @ApiResponse({ status: 200, description: 'Pedido encontrado' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Pedido> {
    return this.pedidosService.findOne(id);
  }

  @Get('cliente/:clienteId')
  @ApiOperation({ summary: 'Listar pedidos de um cliente' })
  @ApiResponse({ status: 200, description: 'Pedidos do cliente retornados' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  findByCliente(
    @Param('clienteId', ParseIntPipe) clienteId: number,
  ): Promise<Pedido[]> {
    return this.pedidosService.findByCliente(clienteId);
  }

  @Post()
  @ApiOperation({ summary: 'Criar novo pedido' })
  @ApiResponse({ status: 201, description: 'Pedido criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Estoque insuficiente ou produto inativo' })
  @ApiResponse({ status: 404, description: 'Cliente ou produto não encontrado' })
  create(@Body() dto: CreatePedidoDto): Promise<Pedido> {
    return this.pedidosService.create(dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualizar status do pedido' })
  @ApiResponse({ status: 200, description: 'Status atualizado com sucesso' })
  @ApiResponse({ status: 400, description: 'Transição de status inválida' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
  atualizarStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AtualizarStatusDto,
  ): Promise<Pedido> {
    return this.pedidosService.atualizarStatus(id, dto);
  }
}
