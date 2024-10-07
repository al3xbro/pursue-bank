import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Prisma, User, Transaction } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('api/internal/transaction')
export class TransactionController {
    constructor(
        private transactionService: TransactionService
    ) {}

    @UseGuards(AuthGuard)
    @Get(':id')
    async getTransactionsByUserId(@Param('id') id: number): Promise<Transaction[] | null> {
        return this.transactionService.transactions({where: { account_id: id}})
    }

    @UseGuards(AuthGuard)
    @Get(':id/balance')
    async getUserBalance(@Param('id') id: number): Promise<Prisma.Decimal | null> {
        const temp: Transaction[] | null = await this.transactionService.getTransactionsForBalance(id)
        if (!temp == null) {
            return this.transactionService.sumOfTransactions(temp as Transaction[], id);
        }
        return null;
    }

    @UseGuards(AuthGuard)
    @Post()
    async createTransaction(@Body() transactionData: Prisma.TransactionCreateInput): Promise<Transaction> {
        if (transactionData.transaction_type == 'WITHDRAW' || 'TRANSFER_INTERNAL' || 'TRANSFER_EXTERNAL') {
            return this.transactionService.createTransaction({
                ...transactionData,
                amount: (transactionData.amount as Prisma.Decimal).mul(-1),
                created_at: '',
            });
        } else {
            return this.transactionService.createTransaction({
                ...transactionData,
                created_at: '',
              });
        }
    }
    
}
