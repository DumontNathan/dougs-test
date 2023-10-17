import { Module } from '@nestjs/common';
import { MovementsController } from './movements.controller';
import { MovementsService } from './movements.service';
import { MovementsUtilsModule } from './utils/movements-utils.module';

@Module({
  imports: [MovementsUtilsModule],
  controllers: [MovementsController],
  providers: [MovementsService],
})
export class MovementsModule {}
