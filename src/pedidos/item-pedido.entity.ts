import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Produto } from '../produtos/produto.entity';
import { Pedido } from './pedido.entity';

@Entity('itens_pedido')
export class ItemPedido {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Pedido, (pedido) => pedido.itens, { nullable: false })
  pedido: Pedido;

  @Column()
  pedidoId: number;

  @ManyToOne(() => Produto, (produto) => produto.itensPedido, {
    nullable: false,
    eager: true,
  })
  produto: Produto;

  @Column()
  produtoId: number;

  @Column()
  quantidade: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precoUnitario: number;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;
}
