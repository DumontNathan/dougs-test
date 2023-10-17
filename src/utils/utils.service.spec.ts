import { Test, TestingModule } from '@nestjs/testing';
import { MovementsUtilsService } from './movements-utils.service';

describe('UtilsService', () => {
  let service: MovementsUtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MovementsUtilsService],
    }).compile();

    service = module.get<MovementsUtilsService>(MovementsUtilsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
