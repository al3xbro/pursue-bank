import { Controller, Get, Post, Body } from '@nestjs/common';
import { AccountService } from './account.service';
import { User } from '@prisma/client';

@Controller('account')
export class AccountController {
    constructor(private accountService: AccountService) {}

    @Post()
    async createAccount(
        @Body() userData: Omit<User, "id" | "status">
    ): Promise<User> {
        return this.accountService.createAccount(
            {...userData, status: 'ACTIVE'}
        );
    }
}
