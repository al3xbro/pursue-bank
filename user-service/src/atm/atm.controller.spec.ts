import { Test, TestingModule } from '@nestjs/testing';
import { AtmController } from './atm.controller';

describe('AtmController', () => {
  let controller: AtmController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AtmController],
    }).compile();

    controller = module.get<AtmController>(AtmController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
