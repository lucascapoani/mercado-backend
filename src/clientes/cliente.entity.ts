import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Pedido } from '../pedidos/pedido.entity';

@Entity('clientes')
@Index('idx_cliente_nome', ['nome'])
@Index('idx_cliente_email', ['email'])
@Index('idx_cliente_ativo', ['ativo'])
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
