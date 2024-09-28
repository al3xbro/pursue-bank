import { Test, TestingModule } from '@nestjs/testing';
import { AutopayService } from './autopay.service';

describe('AutopayService', () => {
  let service: AutopayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AutopayService],
    }).compile();

    service = module.get<AutopayService>(AutopayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
