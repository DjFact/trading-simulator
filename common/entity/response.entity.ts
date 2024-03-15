/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import { ApiProperty } from '@nestjs/swagger';

export class ResponseEntity {
  @ApiProperty()
  status: boolean;
  @ApiProperty({ example: 200 })
  statusCode: number;
  @ApiProperty({ type: Object })
  data: any;
  @ApiProperty({ example: '2021-08-20T14:52:33.648Z' })
  time: string;

  constructor(data: any) {
    this.status = true;
    this.statusCode = 200;
    this.data = data;
    this.time = new Date().toISOString();
  }
}
