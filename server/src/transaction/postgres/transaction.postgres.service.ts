import { Injectable } from '@nestjs/common';
import { Prisma, Transaction } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TransactionPostgresService {
  constructor(private readonly prismaService: PrismaService) { }

  async getTransactionsByAccountId(userId: number): Promise<Transaction[]> {
    return await this.prismaService.transaction.findMany({
      where: {
        OR: [
          { account_id: userId },
          { transfer_id: userId }
        ]
      }
    })
  }

  async createTransaction(data: Omit<Prisma.TransactionCreateInput, 'created_at'>): Promise<Transaction> {
    return await this.prismaService.transaction.create({
      data,
    });
  }
}