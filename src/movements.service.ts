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
    // We need at least 2 balances in order to compare the amount with the movements
    if (balances.length < 2) {
      return this.movementsUtils.setValidationResult(false, [
        this.movementsUtils.setTwoBalancesMinReason(),
      ]);
    }

    balances = this.movementsUtils.sortBalancesAsc(balances);

    const movementsNotInPeriod = this.movementsUtils.findMovementsNotInPeriod(
      balances,
      movements,
    );

    if (movementsNotInPeriod.length) {
      return this.movementsUtils.setValidationResult(false, [
        this.movementsUtils.setMovementsNotInPeriodReason(movementsNotInPeriod),
      ]);
    }

    const movementsDuplicates: Movement[] =
      this.movementsUtils.checkMovementsDuplicates(movements);

    if (movementsDuplicates.length) {
      const filteredMovements: Movement[] =
        this.movementsUtils.filterMovementsDuplicates(movements);

      const missingMovements: MissingMovement[] =
        this.movementsUtils.checkMissingMovements(filteredMovements, balances);

      const validation: ValidationResult =
        this.movementsUtils.setValidationResult(false, [
          this.movementsUtils.setDuplicatesReason(movementsDuplicates),
        ]);

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
      return this.movementsUtils.setValidationResult(false, [
        this.movementsUtils.setMissingMovementsReason(missingMovements),
      ]);
    }

    return { isValid: true };
  }
}
