import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class AccountService {
    constructor(private prisma: PrismaService) {}

    async createAccount(data: Omit<User, "id">): Promise<User> {
        return this.prisma.user.create({data});
    }
}
