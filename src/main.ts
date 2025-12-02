import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO’da olmayan field’ları at
      forbidNonWhitelisted: true, // Fazla field gelirse hata fırlat
      transform: true, // Parametre türlerini otomatik dönüştür
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Estate Commission API')
    .setDescription('Simple transaction & commission backend for case')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
