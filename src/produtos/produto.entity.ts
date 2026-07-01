import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Categoria } from '../categorias/categoria.entity';
import { ItemPedido } from '../pedidos/item-pedido.entity';

@Entity('produtos')
@Index('idx_produto_nome', ['nome'])
@Index('idx_produto_categoria', ['categoriaId'])
@Index('idx_produto_ativo', ['ativo'])
export class Produto {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 150 })
  nome!: string;

  @Column({ length: 500, nullable: true })
  descricao!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  preco!: number;

  @Column({ default: 0 })
  estoque!: number;

  @Column({ length: 50, nullable: true })
  unidade!: string;

  @Column({ default: true })
  ativo!: boolean;

  @ManyToOne(() => Categoria, (categoria) => categoria.produtos, {
    nullable: false,
    eager: false,
  })
  categoria!: Categoria;

  @Column()
  categoriaId!: number;

  @OneToMany(() => ItemPedido, (item) => item.produto)
  itensPedido!: ItemPedido[];
}
