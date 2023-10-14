import { Body, Controller, Get, Post } from '@nestjs/common';
import { MovementsService } from './movements.service';
import { MovementsAndBalances } from './movement.interface';

@Controller('movements')
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {}

  @Get('hello')
  getHello(): string {
    return this.movementsService.getHello();
  }

  @Post('validation')
  getMovementsValidation(
    @Body() movementsAndBalances: MovementsAndBalances,
  ): string {
    console.log(movementsAndBalances);

    return 'Les mouvements ont été validés avec succès.';
  }
}
