import { Exclude } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRoleEnum } from '../enum/user-role.enum';

export class UserEntity {
  @ApiProperty({
    name: 'id',
    type: String,
    description: 'User id',
    example: 'f7b3b3e0-3e3e-4e3e-8e3e-3e3e3e3e3e3e',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: "User's full name",
    example: 'Viktor Plotnikov',
  })
  name: string;

  @ApiProperty({
    type: String,
    description: "User's email",
    example: 'viktorr.plotnikov@gmail.com',
  })
  email: string;

  @ApiPropertyOptional({
    type: String,
    description: "User's country",
    example: 'GB',
  })
  country?: string;

  @ApiProperty({
    enum: UserRoleEnum,
    description: "User's role",
  })
  role: UserRoleEnum;

  @ApiPropertyOptional({
    type: String,
    description: "Operator's phone number",
    example: '+380979399399',
  })
  phone?: string;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Two factor enabled',
  })
  twoFactorEnabled?: boolean;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Two factor verified',
  })
  twoFactorVerified?: boolean;

  @Exclude()
  password: string;

  @Exclude()
  twoFactorSecret?: string;

  @ApiProperty({ type: Date, description: 'User created at' })
  createdAt?: Date;

  @ApiProperty({ type: Date, description: 'User updated at' })
  updatedAt?: Date;

  constructor(partial: Partial<any>) {
    if (!partial) {
      return;
    }
    Object.assign(this, partial.toJSON ? partial.toJSON() : partial);
  }
}
