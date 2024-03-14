import { Transform } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';
import { PageDto } from './page.dto';

export const TransformToDate = ({ value }) => {
  const timestamp = Number(value);
  return isNaN(timestamp) ? new Date(value) : new Date(timestamp);
};

export class DateFilterDto extends PageDto {
  @IsOptional()
  @IsDate()
  @Transform(TransformToDate)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Transform(TransformToDate)
  endDate?: Date;
}
