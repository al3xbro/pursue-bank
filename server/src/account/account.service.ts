import { BadRequestException, Injectable } from '@nestjs/common';
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
      throw new BadRequestException('Email already has a linked account. Forgot your password?');
    }

    return await this.accountPostgresService.createAccount({
      ...data,
      address: "",
      phone: "",
      dob: "",
    });
  }

  async getUserData(uid: number): Promise<User> {
    const user = await this.accountPostgresService.getUserFromId(uid);
    if (user === null) {
      throw new BadRequestException('No user found');
    }
    return await this.accountPostgresService.getUserFromId(uid) as User;
  } 
}
