import { Controller, Get, Module, Res } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { TransactionModule } from './transaction/transaction.module';
import { AutopayModule } from './autopay/autopay.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    AccountModule,
    TransactionModule,
    AutopayModule,
    AuthModule,
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'client', 'dist'),
      exclude: ['/api*'],
    }),
  ],
  providers: [],
})
export class AppModule { }
