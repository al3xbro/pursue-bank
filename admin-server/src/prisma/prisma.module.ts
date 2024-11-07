import { Module } from '@nestjs/common';
import { PrismaUserService } from './prisma.user.service';
import { PrismaAdminService } from './prisma.admin.service';

@Module({
  providers: [PrismaUserService, PrismaAdminService],
  exports: [PrismaUserService, PrismaAdminService],
})
export class PrismaModule { }