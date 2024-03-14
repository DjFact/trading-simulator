/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 11.11.2022 02:04
 */
import { ApiProperty } from '@nestjs/swagger';

export class ResponseErrorEntity {
  @ApiProperty({ example: false })
  status: boolean;
  @ApiProperty({ example: 500 })
  statusCode: number;
  @ApiProperty({ example: 'Error was occurred. Please try again later' })
  error: string;
  @ApiProperty({ example: '2021-08-20T14:52:33.648Z' })
  time: string;

  constructor(exception: any) {
    this.status = false;
    this.statusCode = exception.statusCode || exception.code;
    this.error = exception.message;
    this.time = new Date().toISOString();

    if (Array.isArray(this.error)) {
      this.error = this.error.join(',');
    }
  }
}