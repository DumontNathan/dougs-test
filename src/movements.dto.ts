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

export class MovementsAndBalancesDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MovementDTO)
  movements: MovementDTO[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BalanceDTO)
  balances: BalanceDTO[];
}

export class MissingMovementDTO {
  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsNumber()
  actualTotalMovement: number;

  @IsNumber()
  observedTotalMovement: number;
}

export class ReasonDTO {
  @IsString()
  reason: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MovementDTO)
  duplicates?: MovementDTO[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MissingMovementDTO)
  missingMovements?: MissingMovementDTO[];
}

export class ValidationResponseDTO {
  @IsString()
  message: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReasonDTO)
  reasons?: ReasonDTO[];
}
