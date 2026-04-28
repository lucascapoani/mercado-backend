import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './pedido.entity';
import { ItemPedido } from './item-pedido.entity';
import { PedidosController } from './pedidos.controller';
import { PedidosService } from './pedidos.service';
import { ClientesModule } from '../clientes/clientes.module';
import { ProdutosModule } from '../produtos/produtos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pedido, ItemPedido]),
    ClientesModule,
    ProdutosModule,
  ],
  controllers: [PedidosController],
  providers: [PedidosService],
})
export class PedidosModule {}
