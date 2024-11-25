import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AccountPostgresModule } from './postgres/account.postgres.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [AccountPostgresModule, JwtModule.register({ secret: process.env.JWT_SECRET })],
  controllers: [AccountController],
  providers: [AccountService, PrismaService],
  exports: [AccountPostgresModule],
})
export class AccountModule { }
