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
    async getTransactionsByUserId(@Param('id') id: string): Promise<Transaction[] | null> {
        const uid = Number(id)
        return this.transactionService.transactions({where: { account_id: uid}})
    }

    @UseGuards(AuthGuard)
    @Get(':id/balance')
    async getUserBalance(@Param('id') id: string): Promise<Prisma.Decimal | null> {
        const uid = Number(id)
        const temp: Transaction[] | null = await this.transactionService.getTransactionsForBalance(uid)
        if (temp != null) {
            return this.transactionService.sumOfTransactions(temp as Transaction[], uid);
        }
        return null;
    }

    @UseGuards(AuthGuard)
    @Post()
    async createTransaction(@Body() transactionData: Omit<Prisma.TransactionCreateInput, "created_at">): Promise<Transaction> {
        const amount = transactionData.amount;
        const decimalAmount = new Prisma.Decimal(amount as number)
        if (transactionData.transaction_type == 'WITHDRAW' || 
            transactionData.transaction_type == 'TRANSFER_INTERNAL' || 
            transactionData.transaction_type == 'TRANSFER_EXTERNAL') {
            return this.transactionService.createTransaction({
                ...transactionData,
                amount: decimalAmount.mul(-1),
                created_at: new Date(),
            });
        } else {
            return this.transactionService.createTransaction({
                ...transactionData,
                created_at: new Date(),
                amount: decimalAmount,
            });
        }
    }
    
}
