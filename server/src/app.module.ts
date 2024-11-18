import { Module } from '@nestjs/common';
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
      serveRoot: '/',
      rootPath: join(__dirname, '..', '..', 'web-client', 'dist'),
    }),
    ServeStaticModule.forRoot({
      serveRoot: '/atm',
      rootPath: join(__dirname, '..', '..', 'atm-client', 'dist'),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
