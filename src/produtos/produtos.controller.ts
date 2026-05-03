import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoggingCacheInterceptor } from '../common/interceptors/logging-cache.interceptor';
import { ProdutosService } from './produtos.service';
import {
  AtualizarEstoqueDto,
  CreateProdutoDto,
  UpdateProdutoDto,
} from './produto.dto';
import { Produto } from './produto.entity';

@ApiTags('Produtos')
@Controller('produtos')
export class ProdutosController {
  constructor(private readonly produtosService: ProdutosService) {}

  @Get()
  @UseInterceptors(LoggingCacheInterceptor)
  @CacheKey('produtos_all')
  @CacheTTL(10000)
  @ApiOperation({ summary: 'Listar todos os produtos' })
  @ApiQuery({ name: 'apenasAtivos', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Lista de produtos retornada com sucesso' })
  findAll(@Query('apenasAtivos') apenasAtivos?: string): Promise<Produto[]> {
    return this.produtosService.findAll(apenasAtivos === 'true');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar produto por ID' })
  @ApiResponse({ status: 200, description: 'Produto encontrado' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Produto> {
    return this.produtosService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar novo produto' })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso' })
  create(@Body() dto: CreateProdutoDto): Promise<Produto> {
    return this.produtosService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar produto' })
  @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProdutoDto,
  ): Promise<Produto> {
    return this.produtosService.update(id, dto);
  }

  @Patch(':id/estoque')
  @ApiOperation({ summary: 'Atualizar estoque do produto' })
  @ApiResponse({ status: 200, description: 'Estoque atualizado com sucesso' })
  @ApiResponse({ status: 400, description: 'Estoque insuficiente' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  atualizarEstoque(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AtualizarEstoqueDto,
  ): Promise<Produto> {
    return this.produtosService.atualizarEstoque(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover produto' })
  @ApiResponse({ status: 204, description: 'Produto removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.produtosService.remove(id);
  }
}
