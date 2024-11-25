import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { Transaction } from 'generated/client';
import { AuthGuard } from '../auth/auth.guard';
import { TransactionService } from './transaction.service';

@Controller('api/v1')
export class ExternalController {
  constructor(
    private transactionService: TransactionService,
  ) { }

  @UseGuards(AuthGuard)
  @Post('')
  async createTransactionFromExternal(@Headers('Authorization') authToken: string, @Body() data: {
    amount: number,
    recipientId: number,
    origin: string,
  }): Promise<Transaction> {
    return this.transactionService.createTransactionFromExternal(data);
  }

}
