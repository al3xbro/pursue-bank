import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaAdminService } from 'src/prisma/prisma.admin.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaAdminService, AuthGuard],
  exports: [AuthService],
})
export class AuthModule { }
