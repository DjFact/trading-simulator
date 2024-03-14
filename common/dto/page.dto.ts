import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

export class PageDto {
  private static defaultOffset = 0;
  private static defaultLimit = 50;

  static transformToNumber(value: any): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('Validation page params is failed');
    }
    return val;
  }

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => PageDto.transformToNumber(value))
  readonly offset: number = PageDto.defaultOffset;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => PageDto.transformToNumber(value))
  readonly limit: number = PageDto.defaultLimit;
}
