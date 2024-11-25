import { Injectable } from '@nestjs/common';
import { User } from 'generated/user-client';
import { PrismaUserService } from 'src/prisma/prisma.user.service';
import { userInfo } from 'os';

@Injectable()
export class AccountPostgresService {
  constructor(private readonly prismaUserService: PrismaUserService) { }

  async emailAlreadyInUse(email: string): Promise<Boolean> {
    return !! await this.prismaUserService.user.findFirst({where: {email : email}})
  }

  async getUserFromEmail(email: string): Promise<User | null> {
    return await this.prismaUserService.user.findUnique({where: {email : email}});
  }

  async getUserFromId(uid: number): Promise<User | null> {
    return await this.prismaUserService.user.findUnique({where: {id: uid}});
  }

  async getEmailFromUserId(uid: number): Promise<string | undefined> {
    const user = await this.prismaUserService.user.findUnique({where: {id: uid}});
    return user?.email;
  }

  async getAllUserData(): Promise<User[]> {
    return this.prismaUserService.user.findMany();
  }
}