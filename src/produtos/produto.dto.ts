import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProdutoDto {
  @ApiProperty({ example: 'Leite Integral 1L' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  nome: string;

  @ApiPropertyOptional({ example: 'Leite integral pasteurizado' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  descricao?: string;

  @ApiProperty({ example: 4.99 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  preco: number;

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @IsInt()
  @Min(0)
  estoque?: number;

  @ApiPropertyOptional({ example: 'un' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  unidade?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @ApiProperty({ example: 1, description: 'ID da categoria' })
  @IsInt()
  @IsPositive()
  categoriaId: number;
}

export class UpdateProdutoDto {
  @ApiPropertyOptional({ example: 'Leite Integral 1L' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  nome?: string;

  @ApiPropertyOptional({ example: 'Leite integral pasteurizado' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  descricao?: string;

  @ApiPropertyOptional({ example: 4.99 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  preco?: number;

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @IsInt()
  @Min(0)
  estoque?: number;

  @ApiPropertyOptional({ example: 'un' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  unidade?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  categoriaId?: number;
}

export class AtualizarEstoqueDto {
  @ApiProperty({ example: 50, description: 'Quantidade a adicionar ao estoque (use negativo para reduzir)' })
  @IsInt()
  quantidade: number;
}
