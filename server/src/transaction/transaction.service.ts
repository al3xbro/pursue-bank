import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { TransactionPostgresService } from './postgres/transaction.postgres.service';
import { $Enums, Transaction, TransactionType } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(
    private transactionPostgresService: TransactionPostgresService
  ) { }

  async getTransactionsByAccountId(id: number): Promise<Transaction[]> {
    return await this.transactionPostgresService.getTransactionsByAccountId(id);
  }

  async getBalance(id: number): Promise<number> {
    const transactions = await this.transactionPostgresService.getTransactionsByAccountId(id);
    const transactionsByType = _.groupBy(transactions, 'transaction_type');

    let balance = 0;
    balance += _.sumBy(transactionsByType['INTEREST'], 'amount');
    balance += _.sumBy(transactionsByType['DEPOSIT'], 'amount');
    balance -= _.sumBy(transactionsByType['WITHDRAW'], 'amount');
    balance += _.sumBy([
      ...transactionsByType['TRANSFER_INTERNAL'] || [],
      ...transactionsByType['TRANSFER_EXTERNAL'] || []
    ], (transaction) => {
      return transaction.account_id === id
        ? -transaction.amount.toNumber()
        : transaction.amount.toNumber()
    })

    return balance;
  }

  async createSingleTransaction(data: {
    accountId: number,
    transferId: number,
    amount: number,
    transactionType: string
  }): Promise<Transaction> {
    if (!(data.transactionType in $Enums.TransactionType)) {
      throw new Error('Invalid transaction type');
    }

    return await this.transactionPostgresService.createTransaction({
      amount: data.amount,
      transfer_id: data.transferId,
      transaction_type: data.transactionType as TransactionType,
      user: {
        connect: { id: data.accountId }
      },
      recurring_transaction: undefined
    });
  }
}

