import { Test, TestingModule } from '@nestjs/testing';
import { TransactionPostgresService } from './transaction.postgres.service';
import { PrismaService } from '../../prisma/prisma.service';
import { Transaction, TransactionType } from '@prisma/client';
import { Prisma } from '@prisma/client';

describe('TransactionPostgresService', () => {
  let transactionPostgresService: TransactionPostgresService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    transaction: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockTransactions: Transaction[] = [
    {
      id: 1,
      account_id: 2,
      transfer_id: 1,
      amount: new Prisma.Decimal(100),
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
      amount: new Prisma.Decimal(-200),
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
        TransactionPostgresService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    transactionPostgresService = module.get<TransactionPostgresService>(TransactionPostgresService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(transactionPostgresService).toBeDefined();
  });

  describe('getTransactionsByAccountId', () => {
    it('should fetch transactions for a user by account_id or transfer_id (excluding TRANSFER_EXTERNAL)', async () => {
      const userId = 1;
      mockPrismaService.transaction.findMany.mockResolvedValue(mockTransactions);

      const result = await transactionPostgresService.getTransactionsByAccountId(userId);

      expect(prismaService.transaction.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { account_id: userId },
            {
              transfer_id: userId,
              transaction_type: { not: 'TRANSFER_EXTERNAL' },
            },
          ],
        },
      });
      expect(result).toEqual(mockTransactions);
    });

    it('should return an empty array if no transactions are found', async () => {
      const userId = 99;
      mockPrismaService.transaction.findMany.mockResolvedValue([]);

      const result = await transactionPostgresService.getTransactionsByAccountId(userId);

      expect(prismaService.transaction.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { account_id: userId },
            {
              transfer_id: userId,
              transaction_type: { not: 'TRANSFER_EXTERNAL' },
            },
          ],
        },
      });
      expect(result).toEqual([]);
    });
  });

  describe('createTransaction', () => {
    it('should create a transaction with the provided data', async () => {
      const transactionData: Omit<Prisma.TransactionCreateInput, 'created_at'> = {
        amount: new Prisma.Decimal(150),
        transaction_type: TransactionType.DEPOSIT,
        user: { connect: { id: 1 } },
      };
      const mockCreatedTransaction: Transaction = {
        id: 3,
        account_id: 1,
        transfer_id: null,
        amount: new Prisma.Decimal(150),
        transaction_type: TransactionType.DEPOSIT,
        origin: null,
        destination: null,
        description: null,
        created_at: new Date(),
        recurring_id: null,
      };

      mockPrismaService.transaction.create.mockResolvedValue(mockCreatedTransaction);

      const result = await transactionPostgresService.createTransaction(transactionData);

      expect(prismaService.transaction.create).toHaveBeenCalledWith({
        data: transactionData,
      });
      expect(result).toEqual(mockCreatedTransaction);
    });
  });
});
