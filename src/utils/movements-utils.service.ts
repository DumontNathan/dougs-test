import { Injectable } from '@nestjs/common';
import {
  Balance,
  MissingMovement,
  Movement,
  Reason,
  ValidationResult,
} from '../movements.interface';
import { WordingMovements } from '../wording';

@Injectable()
export class MovementsUtilsService {
  findMovementsNotInPeriod(
    balances: Balance[],
    movements: Movement[],
  ): Movement[] {
    const startDate = new Date(balances[0].date);
    const endDate = new Date(balances[balances.length - 1].date);

    return movements.filter(
      (movement) =>
        new Date(movement.date) < startDate ||
        new Date(movement.date) > endDate,
    );
  }
  checkMovementsDuplicates(movements: Movement[]): Movement[] {
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

  setTwoBalancesMinReason(): Reason {
    return {
      reason: WordingMovements.twoBalancesMin,
    };
  }

  filterMovementsDuplicates(movements: Movement[]): Movement[] {
    const seen = {};
    return movements.filter((movement: Movement) => {
      if (seen[movement.id]) {
        return false;
      }
      seen[movement.id] = true;
      return true;
    });
  }

  checkMissingMovements(
    cleanMovements: Movement[],
    balances: Balance[],
  ): MissingMovement[] {
    const sortedBalances: Balance[] = this.sortBalancesAsc(balances);

    let totalMovementByPeriods: MissingMovement[] =
      this.calculateTotalMovementByPeriods(sortedBalances);
    totalMovementByPeriods = this.updateObservedTotalMovement(
      totalMovementByPeriods,
      cleanMovements,
    );

    return totalMovementByPeriods;
  }

  setDuplicatesReason(movementsDuplicates: Movement[]): Reason {
    return {
      reason: WordingMovements.duplicates,
      duplicates: movementsDuplicates,
    };
  }

  setMissingMovementsReason(missingMovements: MissingMovement[]): Reason {
    return {
      reason: WordingMovements.missing,
      missingMovements: missingMovements,
    };
  }

  setMovementsNotInPeriodReason(movementsNotInPeriod: Movement[]): Reason {
    return {
      reason: WordingMovements.notInPeriod,
      notInPeriod: movementsNotInPeriod,
    };
  }

  sortBalancesAsc(balances): Balance[] {
    return balances.sort((a: Balance, b: Balance) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }

  setValidationResult(isValid: boolean, reasons: Reason[]): ValidationResult {
    return { isValid: isValid, reasons: reasons };
  }

  private calculateTotalMovementByPeriods(
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

    return totalMovementByPeriods;
  }

  private updateObservedTotalMovement(
    totalMovementByPeriods: MissingMovement[],
    movements: Movement[],
  ): MissingMovement[] {
    movements.forEach((movement: Movement) => {
      totalMovementByPeriods.forEach((period: MissingMovement) => {
        if (
          this.isDateWithinPeriod(
            new Date(movement.date),
            new Date(period.startDate),
            new Date(period.endDate),
          )
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

  private isDateWithinPeriod(
    date: Date,
    startDate: Date,
    endDate: Date,
  ): boolean {
    return date >= startDate && date < endDate;
  }
}
