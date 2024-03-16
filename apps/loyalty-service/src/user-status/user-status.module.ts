/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 15/03/2024 23:34
 */
import { Module } from '@nestjs/common';
import { UserStatusController } from './user-status.controller';
import { UserStatusService } from './user-status.service';

@Module({
  imports: [],
  controllers: [UserStatusController],
  providers: [UserStatusService],
})
export class UserStatusModule {}
