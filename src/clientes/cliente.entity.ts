import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Pedido } from '../pedidos/pedido.entity';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 150 })
  nome!: string;

  @Column({ length: 150, unique: true })
  email!: string;

  @Column({ length: 20, nullable: true })
  telefone!: string;

  @Column({ length: 200, nullable: true })
  endereco!: string;

  @Column({ default: true })
  ativo!: boolean;

  @OneToMany(() => Pedido, (pedido) => pedido.cliente)
  pedidos!: Pedido[];
}
