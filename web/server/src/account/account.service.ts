import { BadRequestException, Injectable } from '@nestjs/common';
import { AccountPostgresService } from './postgres/account.postgres.service';
import { User } from 'generated/client';

@Injectable()
export class AccountService {
  constructor(private accountPostgresService: AccountPostgresService) { }

  async createAccount(data: {
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    address: string,
    phone: string,
    dob: string,
  }): Promise<User> {
    if (await this.accountPostgresService.emailAlreadyInUse(data.email)) {
      throw new BadRequestException('Email already has a linked account. Forgot your password?');
    }

    return await this.accountPostgresService.createAccount({
      email: data.email,
      password: data.password,
      first_name: data.firstName,
      last_name: data.lastName,
      address: data.address,
      phone: data.phone,
      dob: data.dob,
    });
  }

  async updateAccount(uid: number, data: {
    email?: string,
    password?: string,
    firstName?: string,
    lastName?: string,
    address?: string,
    phone?: string,
    dob?: string,
  }): Promise<User> {
    return await this.accountPostgresService.updateAccount(uid, {
      email: data.email,
      password: data.password,
      first_name: data.firstName,
      last_name: data.lastName,
      address: data.address,
      phone: data.phone,
      dob: data.dob,
    }) as User;
  }

  async deleteAccount(uid: number): Promise<boolean> {
    return await this.accountPostgresService.deleteAccount(uid);
  }

  async getUserData(uid: number): Promise<User> {
    const user = await this.accountPostgresService.getUserFromId(uid);
    if (user === null) {
      throw new BadRequestException('No user found');
    }
    return await this.accountPostgresService.getUserFromId(uid) as User;
  }
}
