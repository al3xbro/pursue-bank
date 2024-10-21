import { Module } from '@nestjs/common';
import { AutopayPostgresService } from './autopay.postgres.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AutopayPostgresService],
  exports: [AutopayPostgresService]
})
export class AutopayPostgresModule { }
