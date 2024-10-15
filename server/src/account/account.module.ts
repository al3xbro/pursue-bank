import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AccountPostgresModule } from './postgres/account.postgres.module';

@Module({
  imports: [AccountPostgresModule],
  controllers: [AccountController],
  providers: [AccountService, PrismaService],
})
export class AccountModule { }
