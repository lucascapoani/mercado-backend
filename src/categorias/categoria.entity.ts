import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Produto } from '../produtos/produto.entity';

@Entity('categorias')
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nome: string;

  @Column({ length: 255, nullable: true })
  descricao: string;

  @OneToMany(() => Produto, (produto) => produto.categoria)
  produtos: Produto[];
}
