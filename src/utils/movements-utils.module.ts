import { Module } from '@nestjs/common';
import { MovementsUtilsService } from './movements-utils.service';

@Module({
  providers: [MovementsUtilsService],
  exports: [MovementsUtilsService],
})
export class MovementsUtilsModule {}
