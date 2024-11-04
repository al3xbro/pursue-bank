import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) { }

  async signIn(signInInfo: { email: string; password: string }): Promise<any> {
    const user = await this.prismaService.user.findUnique({
      where: { email: signInInfo.email },
    });

    if (user === null || user.password !== signInInfo.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };
    const token = await this.jwtService.signAsync(payload);

    return {
      accessToken: token,
      accountId: user.id,
    };
  }
}
