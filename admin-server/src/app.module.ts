import { Module } from '@nestjs/common';
import { TransactionModule } from './transaction/transaction.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TransactionModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}