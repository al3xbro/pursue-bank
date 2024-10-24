import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { Prisma, User } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('api/internal/user')
export class AccountController {
  constructor(private accountService: AccountService) {}

  // @Post()
  // async createAccount(
  //     @Body() userData: Omit<User, "id" | "status">
  // ): Promise<User> {
  //     return this.accountService.createAccount(
  //         {...userData, status: 'ACTIVE'}
  //     );
  // }

  @Post()
  async createAccount(@Body() data: {
    email: string,
    password: string,
    first_name: string,
    last_name: string
  }): Promise<User> {
    return this.accountService.createAccount({ ...data });
  }

  // Made this to test guard.
  //@UseGuards(AuthGuard)
  //@Get('test')
  //async justForTesting() {
  //  return 'success';
  //}
}
