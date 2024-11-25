import { Test, TestingModule } from '@nestjs/testing';
import { AutopayController } from './autopay.controller';
import { AutopayService } from './autopay.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../auth/auth.guard';

describe('AutopayController', () => {
  let autopayController: AutopayController;
  let autopayService: AutopayService;
  let jwtService: JwtService;

  const mockAutopayService = {
    getAutopaysById: jest.fn(),
    createAutopay: jest.fn(),
    editAutopay: jest.fn(),
  };

  const mockJwtService = {
    decode: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AutopayController],
      providers: [
        {
          provide: AutopayService,
          useValue: mockAutopayService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) }) // Mocking AuthGuard to always allow access
      .compile();

    autopayController = module.get<AutopayController>(AutopayController);
    autopayService = module.get<AutopayService>(AutopayService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(autopayController).toBeDefined();
  });

  describe('getAutopays', () => {
    it('should call autopayService.getAutopaysById with correct parameters', async () => {
      const mockToken = 'Bearer mockToken';
      const mockDecodedToken = { sub: 1 };
      const expectedResult = [{ id: 1, amount: 100, dayOfMonth: 15 }];

      mockJwtService.decode.mockReturnValue(mockDecodedToken);
      mockAutopayService.getAutopaysById.mockResolvedValue(expectedResult);

      const result = await autopayController.getAutopays(mockToken);
      expect(jwtService.decode).toHaveBeenCalledWith('mockToken');
      expect(autopayService.getAutopaysById).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('createAutopay', () => {
    it('should call autopayService.createAutopay with correct parameters', async () => {
      const mockToken = 'Bearer mockToken';
      const mockDecodedToken = { sub: 1 };
      const mockData = {
        amount: 100,
        transactionType: 'TRANSFER_INTERNAL',
        dayOfMonth: 15,
        transferEmail: 'test@gmail.com',
      };
      const expectedResult = { 
        id: 1, 
        transaction_type: 'TRANSFER_INTERNAL',
        day_of_month: 15,
        amount: 100,
        account_id: 1,
        transfer_id: 2,
        status: 'ACTIVE',
        created_at: '2024-11-23T11:27:57.8682'
      };

      mockJwtService.decode.mockReturnValue(mockDecodedToken);
      mockAutopayService.createAutopay.mockResolvedValue(expectedResult);

      const result = await autopayController.createAutopay(mockToken, mockData);
      expect(jwtService.decode).toHaveBeenCalledWith('mockToken');
      expect(autopayService.createAutopay).toHaveBeenCalledWith({
        accountId: 1,
        ...mockData,
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('editAutopay', () => {
    it('should call autopayService.editAutopay with correct parameters', async () => {
      const mockToken = 'Bearer mockToken';
      const mockDecodedToken = { sub: 1 };
      const mockData = {
        id: 1,
        status: 'DISABLED',
      };
      const expectedResult = { 
        id: 1, 
        transaction_type: 'TRANSFER_INTERNAL',
        day_of_month: 15,
        amount: 100,
        account_id: 1,
        transfer_id: 2,
        status: 'DISABLED',
        created_at: '2024-11-23T11:27:57.8682'
      };

      mockJwtService.decode.mockReturnValue(mockDecodedToken);
      mockAutopayService.editAutopay.mockResolvedValue(expectedResult);

      const result = await autopayController.editAutopay(mockToken, mockData);
      expect(jwtService.decode).toHaveBeenCalledWith('mockToken');
      expect(autopayService.editAutopay).toHaveBeenCalledWith(1, mockData);
      expect(result).toEqual(expectedResult);
    });
  });
});
