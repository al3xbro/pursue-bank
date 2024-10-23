import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { TransactionPostgresService } from './postgres/transaction.postgres.service';
import { $Enums, Transaction, TransactionType } from '@prisma/client';
import { AccountPostgresService } from 'src/account/postgres/account.postgres.service';

@Injectable()
export class TransactionService {
  constructor(
    private transactionPostgresService: TransactionPostgresService,
    private accountPostgresService: AccountPostgresService
  ) { }

  async getTransactionsByAccountId(id: number): Promise<Transaction[]> {
    return await this.transactionPostgresService.getTransactionsByAccountId(id);
  }

  async getBalanceByAccountId(id: number): Promise<number> {
    const transactions = await this.transactionPostgresService.getTransactionsByAccountId(id);
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

  async createSingleTransaction(data: {
    accountId: number,
    amount: number,
    transactionType: string,
    transferEmail?: string,
    externalId?: number,
    origin?: string,
    destination?: string,
    recurringTransactionId?: number,
  }): Promise<Transaction> {
    if (!(data.transactionType in $Enums.TransactionType)) {
      throw new Error('Invalid transaction type');
    }

    switch (data.transactionType) {
      case "WITHDRAW":
        return await this.transactionPostgresService.createTransaction({
          amount: data.amount,
          transaction_type: data.transactionType as TransactionType,
          user: {
            connect: { id: data.accountId },
          },
          recurring_transaction: undefined,        
        });
      case "TRANSFER_INTERNAL":
        const transferUser = await this.accountPostgresService.getUserFromEmail(data.transferEmail as string);
        if (transferUser == null) {
          throw new Error('Unregistered email')
        }
        return await this.transactionPostgresService.createTransaction({
          amount: data.amount,
          transfer_id: transferUser.id,
          transaction_type: data.transactionType as TransactionType,
          user: {
            connect: { id: data.accountId }
          },
          recurring_transaction: data.recurringTransactionId 
            ? { connect: { id: data.recurringTransactionId } } 
            : undefined,          
        });
      case "TRANSFER_EXTERNAL":
        return await this.transactionPostgresService.createTransaction({
          amount: data.amount,
          transaction_type: data.transactionType as TransactionType,
          transfer_id: data.externalId as number,
          user: {
            connect: { id: data.accountId }
          },
          origin: data.origin as string,
          destination: data.destination as string,
          recurring_transaction: data.recurringTransactionId 
          ? { connect: { id: data.recurringTransactionId } } 
          : undefined,  
        });
      default:  // DEPOSIT or INTEREST
        return await this.transactionPostgresService.createTransaction({
          amount: -data.amount,
          transaction_type: data.transactionType as TransactionType,
          user: {
            connect: { id: data.accountId },
          },
          recurring_transaction: undefined,
        });
    }
  }
}

