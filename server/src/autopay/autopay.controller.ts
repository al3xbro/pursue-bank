import { Body, Controller, Get, Headers, Post, Put, UseGuards } from '@nestjs/common';
import { Recurring_Transaction, Transaction } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { AutopayService } from './autopay.service';
import { JwtService } from '@nestjs/jwt';

@Controller('api/internal/autopay')
export class AutopayController {
  constructor(
    private autopayService: AutopayService,
    private jwtService: JwtService
  ) { }

  @UseGuards(AuthGuard)
  @Get()
  async getAutopays(@Headers('Authorization') authToken: string): Promise<Recurring_Transaction[]> {
    const id = this.jwtService.decode(authToken.split(' ')[1])['sub'];
    return this.autopayService.getAutopaysById(id)
  }

  @UseGuards(AuthGuard)
  @Post('')
  async createAutopay(@Headers('Authorization') authToken: string, @Body() data: {
    amount: number,
    transactionType: string,
    dayOfMonth: number,
    transferEmail?: string,
    externalId?: number,
    origin?: string,
    destination?: string,
  }): Promise<Recurring_Transaction> {
    const accountId = this.jwtService.decode(authToken.split(' ')[1])['sub'];
    return this.autopayService.createAutopay({ accountId, ...data });
  }

  @UseGuards(AuthGuard)
  @Put('')
  async editAutopay(@Headers('Authorization') authToken: string, @Body() data: {
    amount: number,
    dayOfMonth: number
  }): Promise<Recurring_Transaction> {
    const accountId = this.jwtService.decode(authToken.split(' ')[1])['sub'];
    return this.autopayService.editAutopay(accountId, {
      amount: data.amount,
      date_of_month: data.dayOfMonth,
    });
  }

}
