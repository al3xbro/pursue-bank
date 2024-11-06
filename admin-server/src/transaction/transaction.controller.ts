import { Body, Controller, Get, Headers, Post, UseGuards } from '@nestjs/common';
import { Transaction } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { TransactionService } from './transaction.service';
import { JwtService } from '@nestjs/jwt';

@Controller('api/internal/transaction')
export class TransactionController {
  constructor(
    private transactionService: TransactionService,
    private jwtService: JwtService
  ) { }

  @UseGuards(AuthGuard)
  @Get('')
  async getTransactions(@Headers('Authorization') authToken: string): Promise<Transaction[]> {
    const id = this.jwtService.decode(authToken.split(' ')[1])['sub'];
    return this.transactionService.getTransactionsByAccountId(id)
  }

  @UseGuards(AuthGuard)
  @Get('/balance')
  async getUserBalance(@Headers('Authorization') authToken: string): Promise<{ balance: number }> {
    const id = this.jwtService.decode(authToken.split(' ')[1])['sub'];
    return { balance: await this.transactionService.getBalanceByAccountId(id) }
  }

  @UseGuards(AuthGuard)
  @Post('')
  async createSingleTransaction(@Headers('Authorization') authToken: string, @Body() data: {
    amount: number,
    transactionType: string,
    transferEmail?: string,
    externalId?: number,
    origin?: string,
    destination?: string,
  }): Promise<Transaction> {
    const accountId = this.jwtService.decode(authToken.split(' ')[1])['sub'];
    return this.transactionService.createSingleTransaction({ accountId, ...data });
  }

}
