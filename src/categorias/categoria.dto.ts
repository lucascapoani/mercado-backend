import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoriaDto {
  @ApiProperty({ example: 'Laticínios', description: 'Nome da categoria' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @IsString()
  @MaxLength(100)
  nome: string;

  @ApiPropertyOptional({ example: 'Leites, queijos e derivados' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  descricao?: string;
}

export class UpdateCategoriaDto {
  @ApiPropertyOptional({ example: 'Laticínios' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nome?: string;

  @ApiPropertyOptional({ example: 'Leites, queijos e derivados' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  descricao?: string;
}
