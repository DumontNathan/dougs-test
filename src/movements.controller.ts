import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { MovementsService } from './movements.service';
import { MovementsAndBalancesDto } from './movements.dto';

@Controller('movements')
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {}

  @Post('validation')
  @HttpCode(202)
  movementsValidation(@Body() movementsAndBalances: MovementsAndBalancesDto): {
    message: string;
    reasons?: any[];
  } {
    const movementsValidation =
      this.movementsService.checkIfMovementsAreValids(movementsAndBalances);

    if (movementsValidation.isValid) {
      return { message: 'Accepted' };
    }
    throw new HttpException(
      {
        message: "I'm a teapot",
        reasons: movementsValidation.reasons,
      },
      HttpStatus.I_AM_A_TEAPOT,
    );
  }
}
