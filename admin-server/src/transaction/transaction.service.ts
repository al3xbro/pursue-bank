import { BadRequestException, Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { TransactionPostgresService } from './postgres/transaction.postgres.service';
import { $Enums, Transaction, TransactionType } from 'generated/user-client';
import { AccountPostgresService } from 'src/account/postgres/account.postgres.service';

@Injectable()
export class TransactionService {
  constructor(
    private transactionPostgresService: TransactionPostgresService,
    private accountPostgresService: AccountPostgresService
  ) { }

  async getAllTransactions(): Promise<Transaction[]> {
    return await this.transactionPostgresService.getAllTransactions();
  }

  async getTransactionsByAccountId(id: number): Promise<Transaction[]> {
    const transactions = await this.transactionPostgresService.getTransactionsByAccountId(id);
    if (transactions === null) {
      throw new BadRequestException('User can\'t be found');
    } 
    return transactions;
  }

  async getBalanceByAccountId(id: number): Promise<number> {
    const transactions = await this.getTransactionsByAccountId(id);
    const transactionsByType = _.groupBy(transactions, 'transaction_type');

    let balance = 0;
    balance += _.sumBy([
      ...transactionsByType['INTEREST'] || [],
      ...transactionsByType['DEPOSIT'] || [],
      ...transactionsByType['WITHDRAW'] || [],
      ...transactionsByType['TRANSFER_INTERNAL'] || [],
      ...transactionsByType['TRANSFER_EXTERNAL'] || []
    ], (transaction) => {
      return transaction.account_id === id
        ? -transaction.amount.toNumber()
        : transaction.amount.toNumber()
    })

    return balance;
  }
}

