import { IsArray, IsDate, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class MovementDTO {
  @IsString()
  id: string;

  @IsDate()
  date: Date;

  @IsString()
  label: string;

  @IsString()
  amount: string;
}

export class BalanceDTO {
  @IsDate()
  date: Date;

  @IsString()
  balance: string;
}

export class MovementsAndBalancesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MovementDTO)
  movements: MovementDTO[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BalanceDTO)
  balances: BalanceDTO[];
}
