import { Test, TestingModule } from '@nestjs/testing';
import { AutopayService } from './autopay.service';
import { AutopayPostgresService } from './postgres/autopay.postgres.service';
import { AccountPostgresService } from '../account/postgres/account.postgres.service';
import { TransactionService } from '../transaction/transaction.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Recurring_Transaction, RecurringTransactionStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import * as _ from 'lodash';

describe('AutopayService', () => {
  let autopayService: AutopayService;
  let autopayPostgresService: AutopayPostgresService;
  let accountPostgresService: AccountPostgresService;
  let transactionService: TransactionService;

  const mockAutopayPostgresService = {
    getAutopaysByAccountId: jest.fn(),
    createRecurringTransaction: jest.fn(),
    editRecurringTransaction: jest.fn(),
    getUserIdFromRecurringTransactionId: jest.fn(),
    getRecurringTransactionsByDayOfMonth: jest.fn(),
  };

  const mockAccountPostgresService = {
    getUserFromEmail: jest.fn(),
    getEmailFromUserId: jest.fn(),
  };

  const mockTransactionService = {
    createSingleTransaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AutopayService,
        {
          provide: AutopayPostgresService,
          useValue: mockAutopayPostgresService,
        },
        {
          provide: AccountPostgresService,
          useValue: mockAccountPostgresService,
        },
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
      ],
    }).compile();

    autopayService = module.get<AutopayService>(AutopayService);
    autopayPostgresService = module.get<AutopayPostgresService>(AutopayPostgresService);
    accountPostgresService = module.get<AccountPostgresService>(AccountPostgresService);
    transactionService = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(autopayService).toBeDefined();
  });

  describe('getAutopaysById', () => {
    it('should call autopayPostgresService.getAutopaysByAccountId with correct parameters', async () => {
      const mockId = 1;
      const expectedResult = [{
         id: 1, 
         transaction_type: 'TRANSFER_INTERNAL',
         day_of_month: 15,
         amount: 100,
         account_id: 1,
         transfer_id: 2,
         status: 'ACTIVE',
         created_at: '2024-11-23T11:27:57.8682'
        }];
      mockAutopayPostgresService.getAutopaysByAccountId.mockResolvedValue(expectedResult);

      const result = await autopayService.getAutopaysById(mockId);
      expect(autopayPostgresService.getAutopaysByAccountId).toHaveBeenCalledWith(mockId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('createAutopay', () => {
    it('should throw BadRequestException for invalid transaction type', async () => {
      await expect(
        autopayService.createAutopay({
          accountId: 1,
          amount: 100,
          transactionType: 'INVALID',
          dayOfMonth: 15,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for invalid dayOfMonth', async () => {
      await expect(
        autopayService.createAutopay({
          accountId: 1,
          amount: 100,
          transactionType: 'TRANSFER_INTERNAL',
          dayOfMonth: 35,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should call createRecurringTransaction for TRANSFER_INTERNAL with correct parameters', async () => {
      const mockData = {
        accountId: 1,
        amount: 100,
        transactionType: 'TRANSFER_INTERNAL',
        dayOfMonth: 15,
        transferEmail: 'test@example.com',
      };
      const mockTransferUser = {
        id: 2,
        email: 'test2@gmail.com',
        password: 'password1234',
        firstName: 'Test',
        lastName: 'User',
        address: '123 Main St',
        phone: '1234567890',
        dob: '2000-01-01',
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
       }

      mockAccountPostgresService.getUserFromEmail.mockResolvedValue(mockTransferUser);
      mockAutopayPostgresService.createRecurringTransaction.mockResolvedValue(expectedResult);

      const result = await autopayService.createAutopay(mockData);
      expect(accountPostgresService.getUserFromEmail).toHaveBeenCalledWith(mockData.transferEmail);
      expect(autopayPostgresService.createRecurringTransaction).toHaveBeenCalledWith({
        amount: mockData.amount,
        account_id: mockData.accountId,
        transfer_id: mockTransferUser.id,
        transaction_type: mockData.transactionType,
        day_of_month: mockData.dayOfMonth,
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('editAutopay', () => {
    it('should throw BadRequestException if recurring transaction does not exist', async () => {
      const mockData = { id: 3, amount: 200 };
      mockAutopayPostgresService.getUserIdFromRecurringTransactionId.mockResolvedValue(undefined);

      await expect(autopayService.editAutopay(1, mockData)).rejects.toThrow(BadRequestException);
    });

    it('should throw UnauthorizedException if accountId does not match', async () => {
      const mockData = { id: 1, amount: 200 };
      mockAutopayPostgresService.getUserIdFromRecurringTransactionId.mockResolvedValue(2);

      await expect(autopayService.editAutopay(1, mockData)).rejects.toThrow(UnauthorizedException);
    });

    it('should call editRecurringTransaction with correct parameters', async () => {
      const mockData = { id: 1, amount: 200 };
      const mockAccountId = 1;
      const expectedResult = {
        id: 1, 
        transaction_type: 'TRANSFER_INTERNAL',
        day_of_month: 15,
        amount: new Decimal(200),
        account_id: 1,
        transfer_id: 2,
        status: 'ACTIVE',
        created_at: '2024-11-23T11:27:57.8682'
       };

      mockAutopayPostgresService.getUserIdFromRecurringTransactionId.mockResolvedValue(mockAccountId);
      mockAutopayPostgresService.editRecurringTransaction.mockResolvedValue(expectedResult);

      const result = await autopayService.editAutopay(mockAccountId, mockData);
      expect(autopayPostgresService.editRecurringTransaction).toHaveBeenCalledWith(mockData.id, {
        amount: mockData.amount,
        day_of_month: undefined,
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('performAutopays', () => {
    it('should create transactions for matching recurring transactions', async () => {
      const mockRecurringTransactions = [
        {
          id: 1, 
          transaction_type: 'TRANSFER_INTERNAL',
          day_of_month: 15,
          amount: new Decimal(100),
          account_id: 1,
          transfer_id: 2,
          status: 'ACTIVE',
          created_at: '2024-11-23T11:27:57.8682'
         },
      ];
      mockAutopayPostgresService.getRecurringTransactionsByDayOfMonth.mockResolvedValue(
        mockRecurringTransactions,
      );
      mockAccountPostgresService.getEmailFromUserId.mockResolvedValue('test@example.com');

      await autopayService.performAutopays();

      expect(transactionService.createSingleTransaction).toHaveBeenCalledWith({
        accountId: 1,
        amount: 100,
        transactionType: 'TRANSFER_INTERNAL',
        transferEmail: 'test@example.com',
        externalId: undefined,
        origin: undefined,
        destination: undefined,
        recurringTransactionId: 1,
      });
    });
  });
});
