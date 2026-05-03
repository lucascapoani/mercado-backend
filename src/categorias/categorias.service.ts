import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './categoria.entity';
import { CreateCategoriaDto, UpdateCategoriaDto } from './categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  async findAll(): Promise<Categoria[]> {
    console.log('Buscando categorias no banco de dados...');
    return this.categoriaRepository.find({ order: { nome: 'ASC' } });
  }

  async findOne(id: number): Promise<Categoria> {
    const categoria = await this.categoriaRepository.findOne({
      where: { id },
      relations: ['produtos'],
    });
    if (!categoria) {
      throw new NotFoundException(`Categoria #${id} não encontrada`);
    }
    return categoria;
  }

  async create(dto: CreateCategoriaDto): Promise<Categoria> {
    const existente = await this.categoriaRepository.findOne({
      where: { nome: dto.nome },
    });
    if (existente) {
      throw new ConflictException(
        `Já existe uma categoria com o nome "${dto.nome}"`,
      );
    }
    const categoria = this.categoriaRepository.create(dto);
    return this.categoriaRepository.save(categoria);
  }

  async update(id: number, dto: UpdateCategoriaDto): Promise<Categoria> {
    const categoria = await this.findOne(id);
    if (dto.nome && dto.nome !== categoria.nome) {
      const existente = await this.categoriaRepository.findOne({
        where: { nome: dto.nome },
      });
      if (existente) {
        throw new ConflictException(
          `Já existe uma categoria com o nome "${dto.nome}"`,
        );
      }
    }
    Object.assign(categoria, dto);
    return this.categoriaRepository.save(categoria);
  }

  async remove(id: number): Promise<void> {
    const categoria = await this.findOne(id);
    if (categoria.produtos && categoria.produtos.length > 0) {
      throw new BadRequestException(
        `Não é possível remover a categoria "${categoria.nome}" pois ela possui ${categoria.produtos.length} produto(s) vinculado(s)`,
      );
    }
    await this.categoriaRepository.remove(categoria);
  }
}
