import { BadRequestException, Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { TransactionPostgresService } from './postgres/transaction.postgres.service';
import { $Enums, Transaction, TransactionType } from 'generated/client';
import { AccountPostgresService } from '../account/postgres/account.postgres.service';

@Injectable()
export class TransactionService {
  constructor(
    private transactionPostgresService: TransactionPostgresService,
    private accountPostgresService: AccountPostgresService
  ) { }

  // Changes the meaning of the 'amount' property so that negative means the user loses and positive means they gain.
  makeAmountRelativeToUser(uid: number, tx: Transaction): Transaction {
    const sign = uid === tx.transfer_id ? 1 : -1;
    return { ...tx, amount: tx.amount.mul(sign) }
  }

  async getTransactionsByAccountId(id: number): Promise<Transaction[]> {
    let txs = await this.transactionPostgresService.getTransactionsByAccountId(id);
    return txs.map((tx) => this.makeAmountRelativeToUser(id, tx));
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
      throw new BadRequestException('Invalid transaction type');
    }

    let tx: Transaction;

    switch (data.transactionType) {
      case "WITHDRAW":
        tx = await this.transactionPostgresService.createTransaction({
          amount: data.amount,
          transaction_type: data.transactionType as TransactionType,
          user: {
            connect: { id: data.accountId },
          },
          recurring_transaction: undefined,
        });
        break;
      case "TRANSFER_INTERNAL":
        const transferUser = await this.accountPostgresService.getUserFromEmail(data.transferEmail as string);
        if (transferUser == null) {
          throw new BadRequestException('Unregistered email')
        }
        if (transferUser.id === data.accountId) {
          throw new BadRequestException('Sender and receiver can\'t be the same user')
        }
        tx = await this.transactionPostgresService.createTransaction({
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
        break;
      case "TRANSFER_EXTERNAL":
        tx = await this.transactionPostgresService.createTransaction({
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
        break;
      default:  // DEPOSIT or INTEREST
        tx = await this.transactionPostgresService.createTransaction({
          amount: -data.amount,
          transaction_type: data.transactionType as TransactionType,
          user: {
            connect: { id: data.accountId },
          },
          recurring_transaction: undefined,
        });
    }

    return this.makeAmountRelativeToUser(data.accountId, tx);
  }

  async createTransactionFromExternal(data: {
    amount: number,
    recipientId: number,
    origin: string,
  }): Promise<Transaction> {
    const dummyUserId = 0;
    return await this.transactionPostgresService.createTransaction({
      amount: data.amount,
      transaction_type: TransactionType.TRANSFER_EXTERNAL,
      origin: data.origin,
      destination: 'Pursue Bank',
      user: {
        connect: { id: dummyUserId },  // usually would link to initiating user, but in this case linking to a dummy
      },
      recurring_transaction: undefined,
      transfer_id: data.recipientId,
    });
  }
}

