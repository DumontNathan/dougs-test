import { Injectable } from '@nestjs/common';

@Injectable()
export class MovementsService {
  getHello(): string {
    return 'Hello World!';
  }
}