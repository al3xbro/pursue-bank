import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/admin-client';

@Injectable()
export class PrismaAdminService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
