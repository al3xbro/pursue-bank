import { Module } from '@nestjs/common';
import { TransactionModule } from './transaction/transaction.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    TransactionModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'client', 'dist'),
      exclude: ['/api*'],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }