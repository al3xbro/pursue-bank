import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Transaction, User } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class TransactionService { 
    constructor(private prisma: PrismaService) {}

    // Business logic methods

    async getTransactionsForBalance(id: number): Promise<Transaction[] | null> {
        return await this.prisma.transaction.findMany({
            where: {OR: [
                {account_id: id},
                {transfer_id: id}
            ]}
        })
    }

    async sumOfTransactions(transactions: Transaction[], u_id: number): Promise<Prisma.Decimal | null> {
        var sum = new Decimal(0);
        while (transactions.length > 0) {
            for (let i=0; i<transactions.length; i++) {
                const t = transactions[i];
                if (t.amount != null) {
                    switch (t.transaction_type) {
                        case "WITHDRAW" || "DEPOSIT":       // WITHDRAW will always be -ve
                            sum.plus(t.amount);             // DEPOSIT will always be +ve
                            break;
                        case "TRANSFER_INTERNAL":
                            if (u_id == t.account_id) {
                                sum.plus(t.amount);         // TRANSFER_INTERNAL from user will always be -ve
                            } else if (u_id == t.transfer_id) {
                                sum.minus(t.amount);         // TRANSFER_INTERNAL into user will always be -ve FOR THE ORIGINAL USER
                            }
                            break;
                        case "TRANSFER_EXTERNAL":
                            if (u_id == t.account_id) {
                                sum.plus(t.amount);         // TRANSFER_INTERNAL from user will always be -ve
                            } else if (u_id == t.transfer_id) {
                                sum.minus(t.amount);         // TRANSFER_INTERNAL into user will always be -ve FOR THE ORIGINAL USER
                            }
                            break;
                        case "INTEREST":
                            sum.mul(t.amount);
                            break;
                        default:
                            break;
                    }
                }
            }
        }
        return sum;
    }

    // Prisma database access methods (copied and modified from Nest documentation)

    // retrieve from Transaction table by specific ID(?)
    async transaction(
        transactionWhereUniqueInput: Prisma.TransactionWhereUniqueInput,
      ): Promise<Transaction | null> {
        return this.prisma.transaction.findUnique({
          where: transactionWhereUniqueInput,
        });
      }
    
      // retreive any number of Transactions by where parameter
      async transactions(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.TransactionWhereUniqueInput;
        where?: Prisma.TransactionWhereInput;
        orderBy?: Prisma.TransactionOrderByWithRelationInput;
      }): Promise<Transaction[]> {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.transaction.findMany({
          skip,
          take,
          cursor,
          where,
          orderBy,
        });
      }
    
      async createTransaction(data: Prisma.TransactionCreateInput): Promise<Transaction> {
        return this.prisma.transaction.create({
          data,
        });
      }
    
      async updateTransaction(params: {
        where: Prisma.TransactionWhereUniqueInput;
        data: Prisma.TransactionUpdateInput;
      }): Promise<Transaction> {
        const { data, where } = params;
        return this.prisma.transaction.update({
          data,
          where,
        });
      }
    
      async deleteTransaction(where: Prisma.TransactionWhereUniqueInput): Promise<Transaction> {
        return this.prisma.transaction.delete({
          where,
        });
      }
    }
