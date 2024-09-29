import { Test, TestingModule } from '@nestjs/testing';
import { AutopayController } from './autopay.controller';

describe('AutopayController', () => {
  let controller: AutopayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AutopayController],
    }).compile();

    controller = module.get<AutopayController>(AutopayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
