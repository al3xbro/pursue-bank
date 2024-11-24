import { Injectable } from '@nestjs/common';
import { Prisma, Transaction } from 'generated/user-client';
import { PrismaUserService } from '../../prisma/prisma.user.service';


@Injectable()
export class TransactionPostgresService {
  constructor(
    private readonly prismaUserService: PrismaUserService,
  ) { }

  async getAllTransactions(): Promise<Transaction[]> {
    return await this.prismaUserService.transaction.findMany();
  }

  async getTransactionsByAccountId(userId: number): Promise<Transaction[] | null> {
    if ((await this.prismaUserService.user.findUnique({
      where: {
        id: userId as number
      }
    })) === null) {
      return null;
    }
    
    return await this.prismaUserService.transaction.findMany({
      where: {
        OR: [
          { account_id: userId as number },
          { 
            transfer_id: userId as number,
            transaction_type: {not: "TRANSFER_EXTERNAL"},   // because then transfer_id is someone outside Pursue Bank
          }
        ]
      }
    })
  }
}