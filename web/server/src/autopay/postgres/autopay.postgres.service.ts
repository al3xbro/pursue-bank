import { Injectable } from '@nestjs/common';
import { Prisma, Recurring_Transaction, RecurringTransactionStatus, Transaction } from 'generated/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AutopayPostgresService {
  constructor(private readonly prismaService: PrismaService) { }

  async getAutopaysByAccountId(userId: number): Promise<Recurring_Transaction[]> {
    return await this.prismaService.recurring_Transaction.findMany({
      where: {
        account_id: userId,
        status: RecurringTransactionStatus.ACTIVE
      }
    })
  }

  async createRecurringTransaction(data: Omit<Prisma.Recurring_TransactionCreateInput, 'created_at'>): Promise<Recurring_Transaction> {
    return await this.prismaService.recurring_Transaction.create({
      data,
    });
  }

  async editRecurringTransaction(rtransaction_id: number, data: Prisma.Recurring_TransactionUpdateInput): Promise<Recurring_Transaction> {
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
        status: RecurringTransactionStatus.ACTIVE
      }
    })
  }

  async getUserIdFromRecurringTransactionId(id: number): Promise<number | undefined> {
    return ((await this.prismaService.recurring_Transaction.findUnique({
      where: {
        id: id,
      }
    }))?.account_id as number)
  }
}