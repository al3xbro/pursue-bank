import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma, Recurring_Transaction, Session } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService
    ) {}

    async signIn(signInInfo: {email: string, password: string}): Promise<any> {
        const user = await this.prismaService.user.findUnique(
            { where: { email: signInInfo.email }, }
        );
        if (user === null) {
            throw new UnauthorizedException('Invalid email');
        }
        if (user.password !== signInInfo.password) {
            throw new UnauthorizedException('Incorrect password');
        }

        // Generate token
        const payload = {
            sub: user.id,
            email: user.email,
        }
        let token = await this.jwtService.signAsync(payload);

        // Create new session in database
        let sessionData: Prisma.SessionCreateInput = {
            token: token,
            session_start: new Date(),
            user: {
                connect: { id: user.id },
            }
        }
        let sessionData1: Omit<Session, "id"> = {
            account_id: user.id,
            token: token,
            session_start: new Date(),
        }
        let sessionData2 = {
            account_id: user.id,
            token: token,
            session_start: new Date(),
            user:  {
                connect: { id: user.id }
            },
        }
        this.prismaService.session.create({data: sessionData as Prisma.SessionCreateInput});
        console.log(JSON.stringify(sessionData)); // for debug
        return { accessToken: token };
    }
}
