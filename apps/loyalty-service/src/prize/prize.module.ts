/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 15/03/2024 23:34
 */
import { Module } from '@nestjs/common';
import { PrizeController } from './prize.controller';
import { PrizeService } from './prize.service';

@Module({
  imports: [],
  controllers: [PrizeController],
  providers: [PrizeService],
})
export class PrizeModule {}
