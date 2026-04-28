import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cliente } from '../clientes/cliente.entity';
import { ItemPedido } from './item-pedido.entity';
import { StatusPedido } from './status-pedido.enum';

@Entity('pedidos')
export class Pedido {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Cliente, (cliente) => cliente.pedidos, { nullable: false })
  cliente!: Cliente;

  @Column()
  clienteId!: number;

  @OneToMany(() => ItemPedido, (item) => item.pedido, {
    cascade: true,
    eager: true,
  })
  itens!: ItemPedido[];

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total!: number;

  @Column({
    type: 'varchar',
    default: StatusPedido.ABERTO,
  })
  status!: StatusPedido;

  @Column({ length: 500, nullable: true })
  observacao!: string;

  @CreateDateColumn()
  criadoEm!: Date;

  @UpdateDateColumn()
  atualizadoEm!: Date;
}
