import { Injectable } from '@nestjs/common';

@Injectable()
export class MovementsService {
  getHello(): string {
    return 'Hello World!';
  }

  checkIfMovementsAreValids(movementsAndBalances) {
    console.log(movementsAndBalances);
    return { isValid: false, reasons: null };
  }
}
