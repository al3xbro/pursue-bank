import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { AutopayPostgresService } from './postgres/autopay.postgres.service';
import { $Enums, Transaction, TransactionType, Recurring_Transaction } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { AccountPostgresService } from 'src/account/postgres/account.postgres.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AutopayService {
  constructor(
    private autopayPostgresService: AutopayPostgresService,
    private accountPostgresService: AccountPostgresService,
    private transactionService: TransactionService
  ) { }

  // return all automatic payments that the user created
  // note that unlike transaction, this does not find automatic payments by other users
  async getAutopaysById(id: number): Promise<Recurring_Transaction[]> {
    return await this.autopayPostgresService.getAutopaysByAccountId(id);
  }

  // creates a new recurring transaction
  async createAutopay(data: {
    accountId: number,
    amount: number,
    transactionType: string,
    dayOfMonth: number,
    transferEmail?: string,
    externalId?: number,
    origin?: string,
    destination?: string,
  }): Promise<Recurring_Transaction> {
    if (data.transactionType !== "TRANSFER_INTERNAL" && data.transactionType !== "TRANSFER_EXTERNAL") {
      throw new Error('Invalid recurring transaction type');
    }

    if (!_.inRange(data.dayOfMonth,1,32)) {
      throw new Error('Invalid date')
    }

    if (_.inRange(data.dayOfMonth,29,32)) {
      // send warning message to user that lets them know any transactions on day 29-31 
      // on months without those days default to the last day of that month
    }

    if (data.transactionType === "TRANSFER_INTERNAL") {
      const transferUser = await this.accountPostgresService.getUserFromEmail(data.transferEmail as string);
      if (transferUser == null) {
        throw new Error('Unregistered email')
      }
      return await this.autopayPostgresService.createRecurringTransaction({
        amount: data.amount,
        account_id: data.accountId,
        transfer_id: transferUser.id,
        transaction_type: data.transactionType as TransactionType,
        day_of_month: data.dayOfMonth,
        transaction_list: undefined,       
      });
    } else {  // TRANSFER_EXTERNAL
      return await this.autopayPostgresService.createRecurringTransaction({
        amount: data.amount,
        account_id: data.accountId,
        transfer_id: data.externalId,
        transaction_type: data.transactionType as TransactionType,
        origin: data.origin,
        destination: data.destination,
        day_of_month: data.dayOfMonth,
        transaction_list: undefined,
      })
    }
  }

  // edits an existing recurring transaction
  // users may change the payment date or amount, or switch between ACTIVE and DISABLED
  async editAutopay(accountId: number, data: {
    id: number,
    amount: number,
    day_of_month: number,
  }): Promise<Recurring_Transaction | null> {
    const uid = await this.autopayPostgresService.getUserIdFromRecurringTransactionId(data.id);
    if (uid === undefined) {
      throw new Error("No recurring transaction with provided id exists");
    }
    if (uid as number !== accountId) {
      throw new Error("Unauthorized");
    }
    return await this.autopayPostgresService.editRecurringTransaction(accountId, data);
  }

  // each day at 00:00, execute this to sweep the entire database
  // automatically creates a new transaction for each recurring transaction set to occur today
  // transactions created this way are added to their recurring transaction's array
  // on the 28th+ day of the month, checks if this is the last day of the month
  // executes all payments set to 29-31 if those days do not exist this month
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async performAutopays() {
    const today = new Date();
    const currentDayOfMonth = today.getDate();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const isLastDayOfMonth = currentDayOfMonth === lastDayOfMonth;

    let matchingRecurringTransactions = await this.autopayPostgresService.getRecurringTransactionsByDayOfMonth(currentDayOfMonth);
    if (isLastDayOfMonth) {
      for (let day = currentDayOfMonth+1; day <= 31; day++) {   // Add all days after last day of month
        let moreMatchingRecurringTransactions = await this.autopayPostgresService.getRecurringTransactionsByDayOfMonth(day);
        matchingRecurringTransactions = [...matchingRecurringTransactions, ...moreMatchingRecurringTransactions];
      }
    }

    // Create transactions
    for (const recurringTransaction of matchingRecurringTransactions) {
      this.transactionService.createSingleTransaction({
        accountId: recurringTransaction.account_id as number,
        amount: (recurringTransaction.amount as Decimal).toNumber(),
        transactionType: recurringTransaction.transaction_type as TransactionType,
        transferEmail: await this.accountPostgresService.getEmailFromUserId(recurringTransaction.account_id as number),
        externalId: recurringTransaction.transaction_type === "TRANSFER_EXTERNAL" 
          ? recurringTransaction.transfer_id as number 
          : undefined,
        origin: recurringTransaction.transaction_type === "TRANSFER_EXTERNAL" 
          ? recurringTransaction.origin as string
          : undefined,
        destination: recurringTransaction.transaction_type === "TRANSFER_EXTERNAL" 
          ? recurringTransaction.destination as string
          : undefined,
        recurringTransactionId: recurringTransaction.id,
      })
    }
  }
}

