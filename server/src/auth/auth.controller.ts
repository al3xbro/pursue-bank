import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/internal/auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  // should use DTOs for parameter and return value I guess
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInData: { email: string; password: string }) {
    return this.authService.signIn(signInData);
  }
}
