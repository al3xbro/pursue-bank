import { Injectable } from '@nestjs/common';
import { Prisma, Recurring_Transaction, Transaction } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AutopayPostgresService {
  constructor(private readonly prismaService: PrismaService) { }

  async getAutopaysByAccountId(userId: number): Promise<Recurring_Transaction[]> {
    return await this.prismaService.recurring_Transaction.findMany({
      where: {
        OR: [
          { account_id: userId }
        ]
      }
    })
  }

  async createRecurringTransaction(data: Omit<Prisma.Recurring_TransactionCreateInput, 'created_at'>): Promise<Recurring_Transaction> {
    return await this.prismaService.recurring_Transaction.create({
      data,
    });
  }

  async editRecurringTransaction(rtransaction_id: number, data: Omit<Prisma.Recurring_TransactionCreateInput, 'status' | 'created_at'>): Promise<Recurring_Transaction> {
    return await this.prismaService.recurring_Transaction.update({
        where: {
            id: rtransaction_id,
        },
        data,
    });
  }

  // Doesn't implement any checks regarding days 29-31. The corresponding method in autopay.service.ts does instead.
  async getRecurringTransactionsByDayOfMonth(dayOfMonth: number): Promise<Recurring_Transaction[]> {
    return await this.prismaService.recurring_Transaction.findMany({
      where: {
        day_of_month: dayOfMonth,
      }
    })
  }
}