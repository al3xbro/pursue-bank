import { Controller, Get, Post, Body, UseGuards, Headers, Put } from '@nestjs/common';
import { AccountService } from './account.service';
import { User } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';
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
    firstName: string,
    lastName: string,
    address: string,
    phone: string,
    dob: string,
  }): Promise<User> {
    return this.accountService.createAccount(data);
  }

  @UseGuards(AuthGuard)
  @Put()
  async updateAccount(@Headers('Authorization') authToken: string, @Body() data: {
    email?: string,
    password?: string,
    firstName?: string,
    lastName?: string,
    address?: string,
    phone?: string,
    dob?: string,
  }): Promise<User> {
    const id = this.jwtService.decode(authToken.split(' ')[1])['sub'];
    return this.accountService.updateAccount(id, data);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getUserData(@Headers('Authorization') authToken: string): Promise<User> {
    const id = this.jwtService.decode(authToken.split(' ')[1])['sub'];
    return this.accountService.getUserData(id);
  }
  
}
