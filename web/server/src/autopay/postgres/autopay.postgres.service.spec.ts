import { Test, TestingModule } from '@nestjs/testing';
import { AutopayPostgresService } from './autopay.postgres.service';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Recurring_Transaction, RecurringTransactionStatus, TransactionType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

describe('AutopayPostgresService', () => {
  let autopayPostgresService: AutopayPostgresService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    recurring_Transaction: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AutopayPostgresService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    autopayPostgresService = module.get<AutopayPostgresService>(AutopayPostgresService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(autopayPostgresService).toBeDefined();
  });

  describe('getAutopaysByAccountId', () => {
    it('should return active recurring transactions for a user', async () => {
      const mockRecurringTransactions: Recurring_Transaction[] = [
        {
          id: 1,
          transaction_type: 'TRANSFER_INTERNAL',
          day_of_month: 15,
          amount: new Decimal(100),
          account_id: 1,
          transfer_id: 2,
          origin: null,
          destination: null,
          description: 'Monthly Payment',
          status: RecurringTransactionStatus.ACTIVE,
          created_at: new Date(),
        },
      ];

      mockPrismaService.recurring_Transaction.findMany.mockResolvedValue(mockRecurringTransactions);

      const result = await autopayPostgresService.getAutopaysByAccountId(1);
      expect(prismaService.recurring_Transaction.findMany).toHaveBeenCalledWith({
        where: {
          account_id: 1,
          status: RecurringTransactionStatus.ACTIVE,
        },
      });
      expect(result).toEqual(mockRecurringTransactions);
    });
  });

  describe('createRecurringTransaction', () => {
    it('should create a recurring transaction', async () => {
      const mockTransactionData: Omit<Prisma.Recurring_TransactionCreateInput, 'created_at'> = {
        transaction_type: TransactionType.TRANSFER_EXTERNAL,
        day_of_month: 10,
        amount: new Decimal(150),
        account_id: 2,
        origin: 'Pursue Bank',
        destination: 'Avoid Bank',
      };

      const mockRecurringTransaction: Recurring_Transaction = {
        ...mockTransactionData,
        transaction_type: TransactionType.TRANSFER_EXTERNAL,
        day_of_month: 10,
        amount: new Decimal(10),
        account_id: 2,
        origin: 'Pursue Bank',
        destination: 'Avoid Bank',
        description: null,
        transfer_id: null,
        id: 1,
        status: RecurringTransactionStatus.ACTIVE,
        created_at: new Date(),
      };

      mockPrismaService.recurring_Transaction.create.mockResolvedValue(mockRecurringTransaction);

      const result = await autopayPostgresService.createRecurringTransaction(mockTransactionData);
      expect(prismaService.recurring_Transaction.create).toHaveBeenCalledWith({
        data: mockTransactionData,
      });
      expect(result).toEqual(mockRecurringTransaction);
    });
  });

  describe('editRecurringTransaction', () => {
    it('should edit an existing recurring transaction', async () => {
      const mockTransactionUpdateData: Prisma.Recurring_TransactionUpdateInput = {
        amount: new Decimal(200),
        day_of_month: 20,
        status: RecurringTransactionStatus.DISABLED,
      };

      const mockUpdatedTransaction: Recurring_Transaction = {
        id: 3,
        transaction_type: 'TRANSFER_INTERNAL',
        day_of_month: 20,
        amount: new Decimal(200),
        account_id: 1,
        transfer_id: 2,
        origin: null,
        destination: null,
        description: null,
        status: RecurringTransactionStatus.DISABLED,
        created_at: new Date(),
      };

      mockPrismaService.recurring_Transaction.update.mockResolvedValue(mockUpdatedTransaction);

      const result = await autopayPostgresService.editRecurringTransaction(3, mockTransactionUpdateData);
      expect(prismaService.recurring_Transaction.update).toHaveBeenCalledWith({
        where: {
          id: 3,
        },
        data: mockTransactionUpdateData,
      });
      expect(result).toEqual(mockUpdatedTransaction);
    });
  });

  describe('getRecurringTransactionsByDayOfMonth', () => {
    it('should return recurring transactions for a specific day of the month', async () => {
      const mockRecurringTransactions: Recurring_Transaction[] = [
        {
          id: 4,
          transaction_type: TransactionType.TRANSFER_EXTERNAL,
          day_of_month: 25,
          amount: new Decimal(250),
          account_id: 2,
          transfer_id: 3,
          origin: null,
          destination: null,
          description: null,
          status: RecurringTransactionStatus.ACTIVE,
          created_at: new Date(),
        },
      ];

      mockPrismaService.recurring_Transaction.findMany.mockResolvedValue(mockRecurringTransactions);

      const result = await autopayPostgresService.getRecurringTransactionsByDayOfMonth(25);
      expect(prismaService.recurring_Transaction.findMany).toHaveBeenCalledWith({
        where: {
          day_of_month: 25,
          status: RecurringTransactionStatus.ACTIVE,
        },
      });
      expect(result).toEqual(mockRecurringTransactions);
    });
  });

  describe('getUserIdFromRecurringTransactionId', () => {
    it('should return the account_id associated with a recurring transaction ID', async () => {
      const mockTransaction: Recurring_Transaction = {
        id: 5,
        transaction_type: 'TRANSFER_INTERNAL',
        day_of_month: 10,
        amount: new Decimal(500),
        account_id: 3,
        transfer_id: 4,
        origin: null,
        destination: null,
        description: null,
        status: RecurringTransactionStatus.ACTIVE,
        created_at: new Date(),
      };

      mockPrismaService.recurring_Transaction.findUnique.mockResolvedValue(mockTransaction);

      const result = await autopayPostgresService.getUserIdFromRecurringTransactionId(5);
      expect(prismaService.recurring_Transaction.findUnique).toHaveBeenCalledWith({
        where: {
          id: 5,
        },
      });
      expect(result).toBe(3);
    });

    it('should return undefined if no transaction is found', async () => {
      mockPrismaService.recurring_Transaction.findUnique.mockResolvedValue(null);

      const result = await autopayPostgresService.getUserIdFromRecurringTransactionId(999);
      expect(prismaService.recurring_Transaction.findUnique).toHaveBeenCalledWith({
        where: {
          id: 999,
        },
      });
      expect(result).toBeUndefined();
    });
  });
});
