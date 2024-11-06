import { Controller, Get, Post, Body, UseGuards, Headers } from '@nestjs/common';
import { AccountService } from './account.service';
import { Prisma, User } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('api/internal/user')
export class AccountController {
  constructor(
    private accountService: AccountService,
    private jwtService: JwtService
  ) {}

  @Post()
  async createAccount(@Body() data: {
    email: string,
    password: string,
    first_name: string,
    last_name: string
  }): Promise<User> {
    return this.accountService.createAccount({ ...data });
  }

  @UseGuards(AuthGuard)
  @Get()
  async getUserData(@Headers('Authorization') authToken: string): Promise<User> {
    const id = this.jwtService.decode(authToken.split(' ')[1])['sub'];
    return this.accountService.getUserData(id);
  }
  
}
