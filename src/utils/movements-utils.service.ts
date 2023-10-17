import { Injectable } from '@nestjs/common';
import {
  Balance,
  MissingMovement,
  Movement,
  Reason,
} from '../movements.interface';
import { WordingMovements } from '../wording';

@Injectable()
export class MovementsUtilsService {
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

  // Improvement : handle cases when movements are not in balances periods.
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

  private sortBalancesAsc(balances): Balance[] {
    return balances.sort((a: Balance, b: Balance) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
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
