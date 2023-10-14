import { Injectable } from '@nestjs/common';
import { ValidationResult } from './movements.interface';
import { BalanceDTO, MissingMovementDTO, MovementDTO } from './movements.dto';

@Injectable()
export class MovementsService {
  checkIfMovementsAreValids(
    movements: MovementDTO[],
    balances: BalanceDTO[],
  ): ValidationResult {
    const movementsDuplicates: MovementDTO[] = this.checkDuplicates(movements);

    if (movementsDuplicates.length) {
      const filteredMovements: MovementDTO[] = this.filterDuplicates(movements);

      const missingMovements: MissingMovementDTO[] = this.checkMissingMovements(
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

    const missingMovements: MissingMovementDTO[] = this.checkMissingMovements(
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

  private checkDuplicates(movements: MovementDTO[]) {
    const seen = {};
    const duplicates: MovementDTO[] = [];

    for (const movement of movements) {
      if (seen[movement.id]) {
        duplicates.push(movement);
      } else {
        seen[movement.id] = true;
      }
    }
    return duplicates;
  }

  private filterDuplicates(movements: MovementDTO[]) {
    const seen = {};
    return movements.filter((movement: MovementDTO) => {
      if (seen[movement.id]) {
        return false;
      }
      seen[movement.id] = true;
      return true;
    });
  }

  private checkMissingMovements(
    cleanMovements: MovementDTO[],
    balances: BalanceDTO[],
  ): MissingMovementDTO[] {
    const totalMovementByPeriods: MissingMovementDTO[] = [];

    for (let i = 0; i < balances.length - 1; i++) {
      totalMovementByPeriods.push({
        startDate: balances[i].date,
        endDate: balances[i + 1].date,
        actualTotalMovement: balances[i + 1].balance - balances[i].balance,
        observedTotalMovement: 0,
      });
    }

    cleanMovements.forEach((movement: MovementDTO) => {
      totalMovementByPeriods.forEach((period: MissingMovementDTO) => {
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

  private setDuplicatesReason(movementsDuplicates: MovementDTO[]) {
    return {
      reason: 'duplicates',
      duplicates: movementsDuplicates,
    };
  }

  private setMissingMovementsReason(missingMovements: MissingMovementDTO[]) {
    return {
      reason: 'missing',
      missingMovements: missingMovements,
    };
  }
}
