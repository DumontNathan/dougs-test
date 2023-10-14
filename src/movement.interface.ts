export interface Movement {
  id: number;
  date: string;
  label: string;
  amount: number;
}

export interface Balance {
  date: string;
  balance: number;
}

export interface MovementsAndBalances {
  movements: Movement[];
  balances: Balance[];
}
