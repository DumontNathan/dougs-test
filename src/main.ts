import { NestFactory } from '@nestjs/core';
import { MovementsModule } from './movements.module';

async function bootstrap() {
  const app = await NestFactory.create(MovementsModule);
  await app.listen(3000);
}
bootstrap();
