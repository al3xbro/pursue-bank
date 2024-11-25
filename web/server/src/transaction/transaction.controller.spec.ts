import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../auth/auth.guard';
import { Transaction, TransactionType } from 'generated/client';
import { Decimal } from '@prisma/client/runtime/library';

describe('TransactionController', () => {
  let transactionController: TransactionController;
  let transactionService: TransactionService;
  let jwtService: JwtService;

  const mockTransactionService = {
    getTransactionsByAccountId: jest.fn(),
    getBalanceByAccountId: jest.fn(),
    createSingleTransaction: jest.fn(),
  };

  const mockJwtService = {
    decode: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        { provide: TransactionService, useValue: mockTransactionService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) }) // Mock AuthGuard
      .compile();

    transactionController = module.get<TransactionController>(TransactionController);
    transactionService = module.get<TransactionService>(TransactionService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(transactionController).toBeDefined();
  });

  describe('getTransactions', () => {
    it('should return transactions for the user', async () => {
      const mockAuthToken = 'Bearer mockToken';
      const mockUserId = 1;
      const mockTransactions: Transaction[] = [
        {
          id: 1,
          amount: new Decimal(100),
          account_id: mockUserId,
          transaction_type: TransactionType.DEPOSIT,
          created_at: new Date(),
          transfer_id: null,
          recurring_id: null,
          origin: null,
          destination: null,
          description: null
        },
      ];

      mockJwtService.decode.mockReturnValue({ sub: mockUserId });
      mockTransactionService.getTransactionsByAccountId.mockResolvedValue(mockTransactions);

      const result = await transactionController.getTransactions(mockAuthToken);

      expect(jwtService.decode).toHaveBeenCalledWith('mockToken');
      expect(transactionService.getTransactionsByAccountId).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual(mockTransactions);
    });
  });

  describe('getUserBalance', () => {
    it('should return the user balance', async () => {
      const mockAuthToken = 'Bearer mockToken';
      const mockUserId = 1;
      const mockBalance = 1000;

      mockJwtService.decode.mockReturnValue({ sub: mockUserId });
      mockTransactionService.getBalanceByAccountId.mockResolvedValue(mockBalance);

      const result = await transactionController.getUserBalance(mockAuthToken);

      expect(jwtService.decode).toHaveBeenCalledWith('mockToken');
      expect(transactionService.getBalanceByAccountId).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual({ balance: mockBalance });
    });
  });

  describe('createSingleTransaction', () => {
    it('should create a transaction for the user', async () => {
      const mockAuthToken = 'Bearer mockToken';
      const mockUserId = 1;
      const mockTransactionData = {
        amount: 500,
        transactionType: TransactionType.TRANSFER_INTERNAL,
        transferEmail: 'receiver@gmail.com',
      };
      const mockTransaction: Transaction = {
        id: 1,
        amount: new Decimal(mockTransactionData.amount),
        account_id: mockUserId,
        transfer_id: 2,
        transaction_type: mockTransactionData.transactionType,
        created_at: new Date(),
        description: null,
        origin: null,
        destination: null,
        recurring_id: null,
      };

      mockJwtService.decode.mockReturnValue({ sub: mockUserId });
      mockTransactionService.createSingleTransaction.mockResolvedValue(mockTransaction);

      const result = await transactionController.createSingleTransaction(
        mockAuthToken,
        mockTransactionData,
      );

      expect(jwtService.decode).toHaveBeenCalledWith('mockToken');
      expect(transactionService.createSingleTransaction).toHaveBeenCalledWith({
        accountId: mockUserId,
        ...mockTransactionData,
      });
      expect(result).toEqual(mockTransaction);
    });
  });
});
