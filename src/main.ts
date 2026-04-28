import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validação global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Documentação Swagger
  const config = new DocumentBuilder()
    .setTitle('Mercado API')
    .setDescription(
      'API de backend para gerenciamento de um mercado: categorias, produtos, clientes e pedidos.',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Aplicação rodando em: http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`Documentação Swagger: http://localhost:${process.env.PORT ?? 3000}/api`);
}
bootstrap();
