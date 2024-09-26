import { Test, TestingModule } from '@nestjs/testing';
import { AtmService } from './atm.service';

describe('AtmService', () => {
  let service: AtmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AtmService],
    }).compile();

    service = module.get<AtmService>(AtmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
