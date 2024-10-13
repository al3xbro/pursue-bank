import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AccountPostgresService } from './postgres/account.postgres.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class AccountService {
  constructor(private accountPostgresService: AccountPostgresService) { }

  async createAccount(data: {
    email: string,
    password: string,
    first_name: string,
    last_name: string,
  }): Promise<User> {
    if (await this.accountPostgresService.emailAlreadyInUse(data.email)) {
      throw new Error('Email already has a linked account. Forgot your password?');
    }

    return await this.accountPostgresService.createAccount({
      email: data.email,
      password: data.password,
      first_name: data.first_name,
      last_name: data.last_name,
    });
  }
}
