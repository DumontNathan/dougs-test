import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Balance, Movement, Reason } from './movements.interface';

export class MovementsAndBalancesDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Movement)
  movements: Movement[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Balance)
  balances: Balance[];
}

export class ValidationResponseDTO {
  @IsString()
  message: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Reason)
  reasons?: Reason[];
}
