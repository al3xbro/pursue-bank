import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { userInfo } from 'os';

@Injectable()
export class AccountPostgresService {
  constructor(private readonly prismaService: PrismaService) { }

  async createAccount(data: Omit<Prisma.UserCreateInput, 'status' | 'sessions' | 'transactions'>): Promise<User> {
    return await this.prismaService.user.create({
      data,
    });
  }

  async emailAlreadyInUse(email: string): Promise<Boolean> {
    return !! await this.prismaService.user.findFirst({where: {email : email}})
  }

  async getUserFromEmail(email: string): Promise<User | null> {
    return await this.prismaService.user.findUnique({where: {email : email}});
  }
}