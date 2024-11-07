import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/user-client';

@Injectable()
export class PrismaUserService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
