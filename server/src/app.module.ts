import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { TransactionModule } from './transaction/transaction.module';
import { AutopayModule } from './autopay/autopay.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [AccountModule, TransactionModule, AutopayModule, AuthModule, ScheduleModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
