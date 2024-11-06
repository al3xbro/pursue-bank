import { Controller, Get, Post, Body, UseGuards, Headers, Param } from '@nestjs/common';
import { AccountService } from './account.service';
import { User } from 'generated/user-client';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('api/admin/user')
export class AccountController {
  constructor(
    private accountService: AccountService,
    private jwtService: JwtService
  ) {}

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserData(@Param('id') id: number): Promise<User> {
    return this.accountService.getUserData(id);
  }

  @UseGuards(AuthGuard)
  @Get('')
  async getAllUserData(): Promise<User[]> {
    return this.accountService.getAllUserData();
  }  
}
