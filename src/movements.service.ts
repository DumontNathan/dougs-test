import { Injectable } from '@nestjs/common';
import {
  Balance,
  MissingMovement,
  Movement,
  Reason,
  ValidationResult,
} from './movements.interface';
import { WordingMovements } from './wording';

@Injectable()
export class MovementsService {
  checkIfMovementsAreValids(
    movements: Movement[],
    balances: Balance[],
  ): ValidationResult {
    const movementsDuplicates: Movement[] = this.checkDuplicates(movements);

    if (movementsDuplicates.length) {
      const filteredMovements: Movement[] = this.filterDuplicates(movements);

      const missingMovements: MissingMovement[] = this.checkMissingMovements(
        filteredMovements,
        balances,
      );

      const validation: ValidationResult = {
        isValid: false,
        reasons: [this.setDuplicatesReason(movementsDuplicates)],
      };

      if (missingMovements.length) {
        validation.reasons.push(
          this.setMissingMovementsReason(missingMovements),
        );
      }

      return validation;
    }

    const missingMovements: MissingMovement[] = this.checkMissingMovements(
      movements,
      balances,
    );

    if (missingMovements.length) {
      return {
        isValid: false,
        reasons: [this.setMissingMovementsReason(missingMovements)],
      };
    }

    return { isValid: true };
  }

  private checkDuplicates(movements: Movement[]): Movement[] {
    const seen = {};
    const duplicates: Movement[] = [];

    for (const movement of movements) {
      if (seen[movement.id]) {
        duplicates.push(movement);
      } else {
        seen[movement.id] = true;
      }
    }
    return duplicates;
  }

  private filterDuplicates(movements: Movement[]): Movement[] {
    const seen = {};
    return movements.filter((movement: Movement) => {
      if (seen[movement.id]) {
        return false;
      }
      seen[movement.id] = true;
      return true;
    });
  }

  private checkMissingMovements(
    cleanMovements: Movement[],
    balances: Balance[],
  ): MissingMovement[] {
    const totalMovementByPeriods: MissingMovement[] = [];

    for (let i = 0; i < balances.length - 1; i++) {
      totalMovementByPeriods.push({
        startDate: balances[i].date,
        endDate: balances[i + 1].date,
        actualTotalMovement: balances[i + 1].balance - balances[i].balance,
        observedTotalMovement: 0,
      });
    }

    cleanMovements.forEach((movement: Movement) => {
      totalMovementByPeriods.forEach((period: MissingMovement) => {
        if (
          // enlever new Date
          new Date(movement.date) >= new Date(period.startDate) &&
          new Date(movement.date) < new Date(period.endDate)
        ) {
          period.observedTotalMovement += movement.amount;
        }
      });
    });

    return totalMovementByPeriods.filter(
      (periodItem) =>
        periodItem.actualTotalMovement !== periodItem.observedTotalMovement,
    );
  }

  private setDuplicatesReason(movementsDuplicates: Movement[]): Reason {
    return {
      reason: WordingMovements.duplicates,
      duplicates: movementsDuplicates,
    };
  }

  private setMissingMovementsReason(
    missingMovements: MissingMovement[],
  ): Reason {
    return {
      reason: WordingMovements.missing,
      missingMovements: missingMovements,
    };
  }
}
