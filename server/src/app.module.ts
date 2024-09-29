import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { TransactionModule } from './transaction/transaction.module';
import { AutopayModule } from './autopay/autopay.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AccountModule, TransactionModule, AutopayModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
