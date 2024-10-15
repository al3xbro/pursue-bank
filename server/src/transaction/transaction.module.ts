import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { JwtModule } from '@nestjs/jwt';
import { TransactionPostgresModule } from './postgres/transaction.postgres.module';

@Module({
  imports: [TransactionPostgresModule, JwtModule.register({ secret: process.env.JWT_SECRET })],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule { }
