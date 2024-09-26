import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './account/account.module';
import { TransactionModule } from './transaction/transaction.module';
import { AutopayModule } from './autopay/autopay.module';
import { AtmModule } from './atm/atm.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AccountModule, TransactionModule, AutopayModule, AtmModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
