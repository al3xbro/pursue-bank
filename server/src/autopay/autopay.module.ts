import { Module } from '@nestjs/common';
import { AutopayController } from './autopay.controller';
import { AutopayService } from './autopay.service';

@Module({
  controllers: [AutopayController],
  providers: [AutopayService],
})
export class AutopayModule {}
