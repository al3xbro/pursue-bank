import { Module } from '@nestjs/common';
import { AutopayController } from './autopay.controller';
import { AutopayService } from './autopay.service';
import { AutopayPostgresModule } from './postgres/autopay.postgres.module';
import { AccountModule } from 'src/account/account.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [AutopayPostgresModule, JwtModule.register({ secret: process.env.JWT_SECRET }), AccountModule],
  controllers: [AutopayController],
  providers: [AutopayService],
})
export class AutopayModule {}