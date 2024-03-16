/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 15/03/2024 23:34
 */
import { Controller } from '@nestjs/common';
import { StatusService } from './status.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @MessagePattern()
  getAllStatus() {

  }
}
