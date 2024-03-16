/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HoldingEntity } from './holding.entity';
import { Transform } from 'class-transformer';

export class AccountEntity {
  @ApiProperty({
    type: String,
    description: 'User Id',
    example: '8fbce70d-74cb-42fe-a3f7-525c5f982833',
  })
  userId: string;

  @ApiProperty({
    type: Number,
    description: 'Account balance',
    example: 10000.25,
  })
  balance: number;

  @ApiProperty({
    type: Number,
    description: 'Account reserved balance',
    example: 10000.25,
  })
  reserved: number;

  @ApiPropertyOptional({
    type: [HoldingEntity],
    description: 'Account holdings',
  })
  @Transform(
    ({ value }) => {
      if (null === value) {
        return null;
      }
      return value.map((holding: any) => new HoldingEntity(holding));
    },
    {
      toClassOnly: true,
    },
  )
  holdings?: HoldingEntity[];

  @ApiProperty({ type: Date, description: 'Account created at' })
  createdAt: Date;

  @ApiProperty({ type: Date, description: 'Account updated at' })
  updatedAt: Date;

  constructor(partial: Partial<any>) {
    if (!partial) {
      return;
    }
    Object.assign(this, partial.toJSON ? partial.toJSON() : partial);
  }
}
