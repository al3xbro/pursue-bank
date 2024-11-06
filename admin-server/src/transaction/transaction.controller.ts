import { Body, Controller, Get, Headers, Post, UseGuards, Param } from '@nestjs/common';
import { Transaction } from 'generated/user-client';
import { AuthGuard } from 'src/auth/auth.guard';
import { TransactionService } from './transaction.service';
import { JwtService } from '@nestjs/jwt';

@Controller('api/admin/transaction')
export class TransactionController {
  constructor(
    private transactionService: TransactionService,
    private jwtService: JwtService
  ) { }

  @UseGuards(AuthGuard)
  @Get('')
  async getAllTransactions(): Promise<Transaction[]> {
    return await this.transactionService.getAllTransactions();
  }

  @UseGuards(AuthGuard)
  @Get('balance/:id')
  async getUserBalance(@Param('id') id: number): Promise<{ balance: number }> {
    return { balance: await this.transactionService.getBalanceByAccountId(id) }
  }

}
