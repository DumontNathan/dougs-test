import {
  IsArray,
  IsDate,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class MovementDTO {
  @IsString()
  id: string;

  @IsDate()
  date: Date;

  @IsString()
  label: string;

  @IsNumber()
  amount: number;
}

export class BalanceDTO {
  @IsDate()
  date: Date;

  @IsNumber()
  balance: number;
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
