import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StatusPedido } from './status-pedido.enum';

export class ItemPedidoDto {
  @ApiProperty({ example: 1, description: 'ID do produto' })
  @IsInt()
  @IsPositive()
  produtoId: number;

  @ApiProperty({ example: 2, description: 'Quantidade desejada' })
  @IsInt()
  @IsPositive()
  quantidade: number;
}

export class CreatePedidoDto {
  @ApiProperty({ example: 1, description: 'ID do cliente' })
  @IsInt()
  @IsPositive()
  clienteId: number;

  @ApiProperty({ type: [ItemPedidoDto], description: 'Itens do pedido' })
  @IsArray()
  @ArrayMinSize(1, { message: 'O pedido deve ter ao menos um item' })
  @ValidateNested({ each: true })
  @Type(() => ItemPedidoDto)
  itens: ItemPedidoDto[];

  @ApiPropertyOptional({ example: 'Entregar na portaria' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  observacao?: string;
}

export class AtualizarStatusDto {
  @ApiProperty({ enum: StatusPedido, example: StatusPedido.CONFIRMADO })
  @IsNotEmpty()
  @IsEnum(StatusPedido, {
    message: `Status deve ser um dos valores: ${Object.values(StatusPedido).join(', ')}`,
  })
  status: StatusPedido;
}
