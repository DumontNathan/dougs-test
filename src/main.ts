import { NestFactory } from '@nestjs/core';
import { MovementsModule } from './movements.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(MovementsModule);
  app.enableCors({
    origin: ['http://localhost:4200'],
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
