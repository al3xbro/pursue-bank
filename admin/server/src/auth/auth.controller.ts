import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/admin/auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInData: { email: string; password: string }) {
    return this.authService.signIn(signInData);
  }
}
