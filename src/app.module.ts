import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriasModule } from './categorias/categorias.module';
import { ProdutosModule } from './produtos/produtos.module';
import { ClientesModule } from './clientes/clientes.module';
import { PedidosModule } from './pedidos/pedidos.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,  // 60 segundos
      limit: 100,  // 100 requisições por minuto por IP
    }]),
    CacheModule.register({
      isGlobal: true,
      ttl: 10000,
    }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'mercado.db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    CategoriasModule,
    ProdutosModule,
    ClientesModule,
    PedidosModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
