import { Injectable } from '@nestjs/common';
import {
  Balance,
  MissingMovement,
  Movement,
  ValidationResult,
} from './movements.interface';
import { MovementsUtilsService } from './utils/movements-utils.service';

@Injectable()
export class MovementsService {
  constructor(private movementsUtils: MovementsUtilsService) {}
  checkIfMovementsAreValids(
    movements: Movement[],
    balances: Balance[],
  ): ValidationResult {
    const movementsDuplicates: Movement[] =
      this.movementsUtils.checkMovementsDuplicates(movements);

    if (movementsDuplicates.length) {
      const filteredMovements: Movement[] =
        this.movementsUtils.filterMovementsDuplicates(movements);

      const missingMovements: MissingMovement[] =
        this.movementsUtils.checkMissingMovements(filteredMovements, balances);

      const validation: ValidationResult = {
        isValid: false,
        reasons: [this.movementsUtils.setDuplicatesReason(movementsDuplicates)],
      };

      if (missingMovements.length) {
        validation.reasons.push(
          this.movementsUtils.setMissingMovementsReason(missingMovements),
        );
      }

      return validation;
    }

    const missingMovements: MissingMovement[] =
      this.movementsUtils.checkMissingMovements(movements, balances);

    if (missingMovements.length) {
      return {
        isValid: false,
        reasons: [
          this.movementsUtils.setMissingMovementsReason(missingMovements),
        ],
      };
    }

    return { isValid: true };
  }
}
