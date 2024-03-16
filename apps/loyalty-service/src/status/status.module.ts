/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 15/03/2024 23:34
 */
import { Module } from '@nestjs/common';
import { StatusController } from './status.controller';
import { StatusService } from './status.service';

@Module({
  imports: [],
  controllers: [StatusController],
  providers: [StatusService],
})
export class StatusModule {}
