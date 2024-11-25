import { Module } from '@nestjs/common';
import { TransactionPostgresService } from './transaction.postgres.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TransactionPostgresService],
  exports: [TransactionPostgresService]
})
export class TransactionPostgresModule { }
