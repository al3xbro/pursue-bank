import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaUserService } from 'src/prisma/prisma.user.service';
import { AccountPostgresService } from './postgres/account.postgres.service';
import { User } from 'generated/user-client';

@Injectable()
export class AccountService {
  constructor(private accountPostgresService: AccountPostgresService) { }

  async getUserData(uid: number): Promise<User> {
    const user = await this.accountPostgresService.getUserFromId(uid);
    if (user === null) {
      throw new BadRequestException('No user found');
    }
    return await this.accountPostgresService.getUserFromId(uid) as User;
  } 

  async getAllUserData(): Promise<User[]> {
    return await this.accountPostgresService.getAllUserData();
  }
}
