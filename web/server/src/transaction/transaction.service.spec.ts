import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { TransactionPostgresService } from './postgres/transaction.postgres.service';
import { AccountPostgresService } from '../account/postgres/account.postgres.service';
import { BadRequestException } from '@nestjs/common';
import { Transaction, TransactionType } from 'generated/client';
import { Prisma } from 'generated/client';
import { Decimal } from '@prisma/client/runtime/library';

describe('TransactionService', () => {
  let transactionService: TransactionService;
  let transactionPostgresService: TransactionPostgresService;
  let accountPostgresService: AccountPostgresService;

  const mockTransactionPostgresService = {
    getTransactionsByAccountId: jest.fn(),
    createTransaction: jest.fn(),
  };

  const mockAccountPostgresService = {
    getUserFromEmail: jest.fn(),
  };

  const mockTransactions: Transaction[] = [
    {
      id: 1,
      account_id: 1,
      transfer_id: 2,
      amount: new Decimal(100),
      transaction_type: TransactionType.TRANSFER_INTERNAL,
      origin: null,
      destination: null,
      description: null,
      created_at: new Date(),
      recurring_id: null,
    },
    {
      id: 2,
      account_id: 1,
      transfer_id: null,
      amount: new Decimal(-200),
      transaction_type: TransactionType.DEPOSIT,
      origin: null,
      destination: null,
      description: null,
      created_at: new Date(),
      recurring_id: null,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        { provide: TransactionPostgresService, useValue: mockTransactionPostgresService },
        { provide: AccountPostgresService, useValue: mockAccountPostgresService },
      ],
    }).compile();

    transactionService = module.get<TransactionService>(TransactionService);
    transactionPostgresService = module.get<TransactionPostgresService>(TransactionPostgresService);
    accountPostgresService = module.get<AccountPostgresService>(AccountPostgresService);
  });

  it('should be defined', () => {
    expect(transactionService).toBeDefined();
  });

  describe('makeAmountRelativeToUser', () => {
    it('should adjust the transaction amount relative to the user', () => {
      const transaction = mockTransactions[0];
      const result = transactionService.makeAmountRelativeToUser(1, transaction);
      expect(result.amount.toNumber()).toBe(-100);
    });
  });

  describe('getTransactionsByAccountId', () => {
    it('should return transactions with adjusted amounts', async () => {
      mockTransactionPostgresService.getTransactionsByAccountId.mockResolvedValue(mockTransactions);

      const result = await transactionService.getTransactionsByAccountId(1);

      expect(transactionPostgresService.getTransactionsByAccountId).toHaveBeenCalledWith(1);
      expect(result[0].amount.toNumber()).toBe(-100); // sign flipped to be relative to current user
      expect(result[1].amount.toNumber()).toBe(200); // sign flipped to be relative to current user
    });
  });

  describe('getBalanceByAccountId', () => {
    it('should calculate the user\'s balance', async () => {
      mockTransactionPostgresService.getTransactionsByAccountId.mockResolvedValue(mockTransactions);

      const result = await transactionService.getBalanceByAccountId(1);

      expect(transactionPostgresService.getTransactionsByAccountId).toHaveBeenCalledWith(1);
      expect(result).toBe(-100 + 200);
    });
  });

  describe('createSingleTransaction', () => {
    it('should throw an exception for an invalid transaction type', async () => {
      const invalidData = { accountId: 1, amount: 100, transactionType: 'INVALID_TYPE' };

      await expect(transactionService.createSingleTransaction(invalidData)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create a DEPOSIT transaction', async () => {
      const data = { accountId: 1, amount: 100, transactionType: 'DEPOSIT' };
      const mockTransaction = {
        id: 2,
        account_id: 1,
        transfer_id: null,
        amount: new Decimal(-100),
        transaction_type: TransactionType.DEPOSIT,
        origin: null,
        destination: null,
        description: null,
        created_at: new Date(),
        recurring_id: null,
      };

      mockTransactionPostgresService.createTransaction.mockResolvedValue(mockTransaction);

      const result = await transactionService.createSingleTransaction(data);

      expect(transactionPostgresService.createTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: -100,
          transaction_type: TransactionType.DEPOSIT,
          user: { connect: { id: 1 } },
        }),
      );
      expect(result.amount.toNumber()).toBe(100); // sign flipped to be relative to current user
    });

    it('should create a TRANSFER_INTERNAL transaction', async () => {
      const data = { accountId: 1, amount: 100, transactionType: 'TRANSFER_INTERNAL', transferEmail: 'receiver@gmail.com' };
      const mockReceiver = { id: 2 };

      mockAccountPostgresService.getUserFromEmail.mockResolvedValue(mockReceiver);
      const mockTransaction = {
        id: 2,
        account_id: 1,
        transfer_id: 2,
        amount: new Decimal(100),
        transaction_type: TransactionType.TRANSFER_INTERNAL,
        origin: null,
        destination: null,
        description: null,
        created_at: new Date(),
        recurring_id: null,
      };

      mockTransactionPostgresService.createTransaction.mockResolvedValue(mockTransaction);

      const result = await transactionService.createSingleTransaction(data);

      expect(accountPostgresService.getUserFromEmail).toHaveBeenCalledWith('receiver@gmail.com');
      expect(transactionPostgresService.createTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 100,
          transfer_id: 2,
          transaction_type: TransactionType.TRANSFER_INTERNAL,
        }),
      );
      expect(result.amount.toNumber()).toBe(-100); // sign flipped to be relative to current user
    });

    it('should throw an exception for a self-transfer', async () => {
      const data = { accountId: 1, amount: 100, transactionType: 'TRANSFER_INTERNAL', transferEmail: 'sender@gmail.com' };

      mockAccountPostgresService.getUserFromEmail.mockResolvedValue({ id: 1 });

      await expect(transactionService.createSingleTransaction(data)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create a TRANSFER_EXTERNAL transaction', async () => {
      const data = {
        accountId: 1,
        amount: 100,
        transactionType: 'TRANSFER_EXTERNAL',
        externalId: 99,
        origin: 'Pursue Bank',
        destination: 'Avoid Bank',
      };
      const mockTransaction = {
        id: 2,
        account_id: 1,
        transfer_id: 99,
        amount: new Decimal(100),
        transaction_type: TransactionType.TRANSFER_EXTERNAL,
        origin: 'Pursue Bank',
        destination: 'Avoid Bank',
        description: null,
        created_at: new Date(),
        recurring_id: null,
      }

      mockTransactionPostgresService.createTransaction.mockResolvedValue(mockTransaction);

      const result = await transactionService.createSingleTransaction(data);

      expect(transactionPostgresService.createTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 100,
          transfer_id: 99,
          origin: 'Pursue Bank',
          destination: 'Avoid Bank',
          transaction_type: TransactionType.TRANSFER_EXTERNAL,
        }),
      );
      expect(result.amount.toNumber()).toBe(-100);  // sign flipped to be relative to current user
    });
  });
});
