import {
  MovementsAndBalancesDTO,
  ValidationResponseDTO,
} from '../movements.dto';
import { WordingMovements } from '../wording';

export const validMovementsAndBalancesMock: MovementsAndBalancesDTO = {
  movements: [
    {
      id: 1,
      date: new Date('2023-10-01'),
      label: 'Transaction A',
      amount: 100,
    },
    {
      id: 2,
      date: new Date('2023-10-02'),
      label: 'Transaction B',
      amount: 200,
    },
    {
      id: 3,
      date: new Date('2023-10-04'),
      label: 'Transaction D',
      amount: 50,
    },
  ],
  balances: [
    { date: new Date('2023-10-01'), balance: 1000 },
    { date: new Date('2023-10-15'), balance: 1350 },
  ],
};

export const validMovementsResponseMock: ValidationResponseDTO = {
  message: WordingMovements.accepted,
};

export const duplicatesMovementsAndBalancesMock: MovementsAndBalancesDTO = {
  movements: [
    {
      id: 1,
      date: new Date('2023-10-01'),
      label: 'Transaction A',
      amount: 100,
    },
    {
      id: 2,
      date: new Date('2023-10-02'),
      label: 'Transaction B',
      amount: 200,
    },
    {
      id: 3,
      date: new Date('2023-10-04'),
      label: 'Transaction D',
      amount: 50,
    },
    {
      id: 3,
      date: new Date('2023-10-04'),
      label: 'Transaction D',
      amount: 50,
    },
  ],
  balances: [
    { date: new Date('2023-10-01'), balance: 1000 },
    { date: new Date('2023-10-15'), balance: 1350 },
  ],
};

export const duplicatesMovementsResponseMock: ValidationResponseDTO = {
  message: WordingMovements.teapot,
  reasons: [
    {
      reason: WordingMovements.duplicates,
      duplicates: [
        {
          id: 3,
          date: new Date('2023-10-04'),
          label: 'Transaction D',
          amount: 50,
        },
      ],
    },
  ],
};

export const missingMovementsAndBalancesMock: MovementsAndBalancesDTO = {
  movements: [
    {
      id: 1,
      date: new Date('2023-10-01'),
      label: 'Transaction A',
      amount: 100,
    },
    {
      id: 2,
      date: new Date('2023-10-02'),
      label: 'Transaction B',
      amount: 200,
    },
    {
      id: 3,
      date: new Date('2023-10-04'),
      label: 'Transaction D',
      amount: 50,
    },
  ],
  balances: [
    { date: new Date('2023-10-01'), balance: 1000 },
    { date: new Date('2023-10-15'), balance: 1500 },
  ],
};

export const missingMovementsResponseMock: ValidationResponseDTO = {
  message: WordingMovements.teapot,
  reasons: [
    {
      reason: WordingMovements.missing,
      missingMovements: [
        {
          startDate: new Date('2023-10-01'),
          endDate: new Date('2023-10-15'),
          actualTotalMovement: 500,
          observedTotalMovement: 350,
        },
      ],
    },
  ],
};

export const outOfPeriodMovementsAndBalancesMock: MovementsAndBalancesDTO = {
  movements: [
    {
      id: 1,
      date: new Date('2023-10-01'),
      label: 'Transaction A',
      amount: 100,
    },
    {
      id: 2,
      date: new Date('2023-10-02'),
      label: 'Transaction B',
      amount: 200,
    },
    {
      id: 3,
      date: new Date('2023-12-04'),
      label: 'Transaction D',
      amount: 50,
    },
  ],
  balances: [
    { date: new Date('2023-10-01'), balance: 1000 },
    { date: new Date('2023-10-15'), balance: 1500 },
  ],
};

export const outOfPeriodMovementsResponseMock: ValidationResponseDTO = {
  message: WordingMovements.teapot,
  reasons: [
    {
      reason: WordingMovements.notInPeriod,
      duplicates: [
        {
          id: 3,
          date: new Date('2023-12-04'),
          label: 'Transaction D',
          amount: 50,
        },
      ],
    },
  ],
};

export const oneBalanceMovementsAndBalancesMock: MovementsAndBalancesDTO = {
  movements: [
    {
      id: 1,
      date: new Date('2023-10-01'),
      label: 'Transaction A',
      amount: 100,
    },
  ],
  balances: [{ date: new Date('2023-10-01'), balance: 1000 }],
};

export const oneBalanceMovementsResponseMock: ValidationResponseDTO = {
  message: WordingMovements.twoBalancesMin,
};
