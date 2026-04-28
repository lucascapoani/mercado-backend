import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './cliente.entity';
import { CreateClienteDto, UpdateClienteDto } from './cliente.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  async findAll(): Promise<Cliente[]> {
    return this.clienteRepository.find({ order: { nome: 'ASC' } });
  }

  async findOne(id: number): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({ where: { id } });
    if (!cliente) {
      throw new NotFoundException(`Cliente #${id} não encontrado`);
    }
    return cliente;
  }

  async create(dto: CreateClienteDto): Promise<Cliente> {
    const existente = await this.clienteRepository.findOne({
      where: { email: dto.email },
    });
    if (existente) {
      throw new ConflictException(
        `Já existe um cliente com o email "${dto.email}"`,
      );
    }
    const cliente = this.clienteRepository.create({ ...dto, ativo: true });
    return this.clienteRepository.save(cliente);
  }

  async update(id: number, dto: UpdateClienteDto): Promise<Cliente> {
    const cliente = await this.findOne(id);
    if (dto.email && dto.email !== cliente.email) {
      const existente = await this.clienteRepository.findOne({
        where: { email: dto.email },
      });
      if (existente) {
        throw new ConflictException(
          `Já existe um cliente com o email "${dto.email}"`,
        );
      }
    }
    Object.assign(cliente, dto);
    return this.clienteRepository.save(cliente);
  }

  async remove(id: number): Promise<void> {
    const cliente = await this.findOne(id);
    await this.clienteRepository.remove(cliente);
  }
}
