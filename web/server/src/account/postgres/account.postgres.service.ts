import { Injectable } from '@nestjs/common';
import { Prisma, User } from 'generated/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AccountPostgresService {
  constructor(private readonly prismaService: PrismaService) { }

  async createAccount(data: Omit<Prisma.UserCreateInput, 'status' | 'sessions' | 'transactions'>): Promise<User> {
    return await this.prismaService.user.create({
      data,
    });
  }

  async emailAlreadyInUse(email: string): Promise<Boolean> {
    return !! await this.prismaService.user.findFirst({ where: { email: email, status: 'ACTIVE' } })
  }

  async getUserFromEmail(email: string): Promise<User | null> {
    return await this.prismaService.user.findFirst({ where: { email: email, status: 'ACTIVE' } });
  }

  async getUserFromId(uid: number): Promise<User | null> {
    return await this.prismaService.user.findFirst({ where: { id: uid } });
  }

  async getEmailFromUserId(uid: number): Promise<string | undefined> {
    const user = await this.prismaService.user.findFirst({ where: { id: uid } });
    return user?.email;
  }

  async updateAccount(uid: number, data: Prisma.UserUpdateInput): Promise<User | null> {
    return this.getUserFromId(uid) === null
      ? null    // returns null if no user with provided id exists
      : await this.prismaService.user.update({
        where: {
          id: uid,
        },
        data,
      })
  }

  async deleteAccount(uid: number): Promise<boolean> {
    const res = await this.prismaService.user.update({
      where: {
        id: uid,
      },
      data: {
        status: 'DELETED',
      },
    });
    return !!res
  }
}