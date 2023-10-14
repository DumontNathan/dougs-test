import { Test, TestingModule } from '@nestjs/testing';
import { MovementsController } from './movements.controller';
import { MovementsService } from './movements.service';

describe('AppController', () => {
  let appController: MovementsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MovementsController],
      providers: [MovementsService],
    }).compile();

    appController = app.get<MovementsController>(MovementsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
