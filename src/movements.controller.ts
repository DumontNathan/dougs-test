import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { MovementsService } from './movements.service';
import {
  BalanceDTO,
  MovementDTO,
  MovementsAndBalancesDTO,
  ValidationResponseDTO,
} from './movements.dto';
import { ValidationResult } from './movements.interface';
import { WordingMovements } from './wording';

@Controller('movements')
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {}

  @Post('validation')
  @HttpCode(202)
  movementsValidation(
    @Body() movementsAndBalances: MovementsAndBalancesDTO,
  ): ValidationResponseDTO {
    const movements: MovementDTO[] = movementsAndBalances.movements;
    const balances: BalanceDTO[] = movementsAndBalances.balances;

    if (balances.length < 2) {
      throw new HttpException(
        {
          message: WordingMovements.twoBalancesMin,
        },
        HttpStatus.I_AM_A_TEAPOT,
      );
    }

    const movementsValidation: ValidationResult =
      this.movementsService.checkIfMovementsAreValids(movements, balances);

    if (movementsValidation.isValid) {
      return { message: WordingMovements.accepted };
    }
    throw new HttpException(
      {
        message: WordingMovements.teapot,
        reasons: movementsValidation.reasons,
      },
      HttpStatus.I_AM_A_TEAPOT,
    );
  }
}