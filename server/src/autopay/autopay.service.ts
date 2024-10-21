import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { AutopayPostgresService } from './postgres/autopay.postgres.service';
import { $Enums, Transaction, TransactionType, Recurring_Transaction } from '@prisma/client';
import { AccountPostgresService } from 'src/account/postgres/account.postgres.service';


@Injectable()
export class AutopayService {
  constructor(
    private autopayPostgresService: AutopayPostgresService,
    private accountPostgresService: AccountPostgresService
  ) { }

  // return all automatic payments that the user created
  // note that unlike transaction, this does not find automatic payments by other users
  async getAutopaysById(id: number): Promise<Recurring_Transaction[]> {
    return await this.autopayPostgresService.getAutopaysByAccountId(id);
  }

  // creates a new recurring transaction
  async createAutopay(data: {
    accountId: number,
    email: string,
    amount: number,
    transactionType: string,
    day_of_month: number
  }): Promise<Recurring_Transaction> {
    if (!(data.transactionType in $Enums.TransactionType)) {
      throw new Error('Invalid transaction type');
    }

    const user = await this.accountPostgresService.getUserFromEmail(data.email);
    if (user == null) {
      throw new Error('Unregistered email')
    }

    if (!_.inRange(data.day_of_month,1,32)) {
      throw new Error('Invalid date')
    }

    if (_.inRange(data.day_of_month,29,32)) {
      // send warning message to user that lets them know any transactions on day 29-31 
      // on months without those days default to the last day of that month
    }

    return await this.autopayPostgresService.createRecurringTransaction({
      amount: data.amount,
      transfer_id: user.id,
      transaction_type: data.transactionType as TransactionType,
      day_of_month: data.day_of_month,
      transaction_list: undefined
    });
  }

  // edits an existing recurring transaction
  // users may change the payment date or amount, or switch between ACTIVE and DISABLED
  async editAutopay(id: number, data: {
    amount: number,
    date_of_month: number,
    status: 
  }): Promise<Recurring_Transaction> {


    return await this.autopayPostgresService.editRecurringTransaction({
        rtransaction_id: id,
        data,
    });
  }

  // each day at 00:00, execute this to sweep the entire database
  // automatically creates a new transaction for each recurring transaction set to occur today
  // transactions created this way are added to their recurring transaction's array
  // on the 28th+ day of the month, checks if this is the last day of the month
  // executes all payments set to 29-31 if those days do not exist this month
  async performAutopays() {

  }
}

