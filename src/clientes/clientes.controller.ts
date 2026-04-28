import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClientesService } from './clientes.service';
import { CreateClienteDto, UpdateClienteDto } from './cliente.dto';
import { Cliente } from './cliente.entity';

@ApiTags('Clientes')
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os clientes' })
  findAll(): Promise<Cliente[]> {
    return this.clientesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar cliente por ID' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Cliente> {
    return this.clientesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Cadastrar novo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente cadastrado com sucesso' })
  @ApiResponse({ status: 409, description: 'Email já cadastrado' })
  create(@Body() dto: CreateClienteDto): Promise<Cliente> {
    return this.clientesService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar cliente' })
  @ApiResponse({ status: 200, description: 'Cliente atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateClienteDto,
  ): Promise<Cliente> {
    return this.clientesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover cliente' })
  @ApiResponse({ status: 204, description: 'Cliente removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.clientesService.remove(id);
  }
}
