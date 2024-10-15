import { Module } from '@nestjs/common';
import { AccountPostgresService } from './account.postgres.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AccountPostgresService],
  exports: [AccountPostgresService]
})
export class AccountPostgresModule { }