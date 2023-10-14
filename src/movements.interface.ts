import { ReasonDTO } from './movements.dto';

export interface ValidationResult {
  isValid: boolean;
  reasons?: ReasonDTO[];
}
