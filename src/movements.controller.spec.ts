import { Test } from '@nestjs/testing';
import { MovementsController } from './movements.controller';
import { MovementsService } from './movements.service';
import {
  duplicatesMovementsAndBalancesMock,
  duplicatesMovementsResponseMock,
  missingMovementsAndBalancesMock,
  missingMovementsResponseMock,
  oneBalanceMovementsAndBalancesMock,
  oneBalanceMovementsResponseMock,
  outOfPeriodMovementsAndBalancesMock,
  outOfPeriodMovementsResponseMock,
  validMovementsAndBalancesMock,
  validMovementsResponseMock,
} from './tests-mocks/movements-mocks';
import { MovementsUtilsService } from './utils/movements-utils.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('movementController', () => {
  let movementsController: MovementsController;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [MovementsController],
      providers: [MovementsService, MovementsUtilsService],
    }).compile();

    movementsController =
      moduleRef.get<MovementsController>(MovementsController);
  });

  describe('movementsValidation', () => {
    it('should return accepted response when movements are valid', () => {
      expect(
        movementsController.movementsValidation(validMovementsAndBalancesMock),
      ).toStrictEqual(validMovementsResponseMock);
    });

    it('should return an exception teapot response with right reasons when movements are duplicates', () => {
      expect(() => {
        movementsController.movementsValidation(
          duplicatesMovementsAndBalancesMock,
        );
      }).toThrow(
        new HttpException(
          duplicatesMovementsResponseMock,
          HttpStatus.I_AM_A_TEAPOT,
        ),
      );
    });

    it('should return an exception teapot response with right reasons when movements are missing', () => {
      expect(() => {
        movementsController.movementsValidation(
          missingMovementsAndBalancesMock,
        );
      }).toThrow(
        new HttpException(
          missingMovementsResponseMock,
          HttpStatus.I_AM_A_TEAPOT,
        ),
      );
    });

    it('should return an exception teapot response with right reasons when movements are off period', () => {
      expect(() => {
        movementsController.movementsValidation(
          outOfPeriodMovementsAndBalancesMock,
        );
      }).toThrow(
        new HttpException(
          outOfPeriodMovementsResponseMock,
          HttpStatus.I_AM_A_TEAPOT,
        ),
      );
    });

    it('should return an exception teapot response with right reasons when not enough balances', () => {
      expect(() => {
        movementsController.movementsValidation(
          oneBalanceMovementsAndBalancesMock,
        );
      }).toThrow(
        new HttpException(
          oneBalanceMovementsResponseMock,
          HttpStatus.I_AM_A_TEAPOT,
        ),
      );
    });

    // ... test every other possibilities
  });
});
