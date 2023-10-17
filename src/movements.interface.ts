import {
  IsArray,
  IsDateString,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export interface ValidationResult {
  isValid: boolean;
  reasons?: Reason[];
}

export class Movement {
  @IsNumber()
  id: number;

  @IsDateString()
  date: Date;

  @IsString()
  label: string;

  @IsNumber()
  amount: number;
}

export class Balance {
  @IsDateString()
  date: Date;

  @IsNumber()
  balance: number;
}

export class MissingMovement {
  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;

  @IsNumber()
  actualTotalMovement: number;

  @IsNumber()
  observedTotalMovement: number;
}

export class Reason {
  @IsString()
  reason: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Movement)
  duplicates?: Movement[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MissingMovement)
  missingMovements?: MissingMovement[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Movement)
  notInPeriod?: Movement[];
}
