import {
  BeforeBulkUpdate,
  BeforeCreate,
  Column,
  CreatedAt,
  DataType,
  Index,
  PrimaryKey,
  Table,
  UpdatedAt,
  Model,
} from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import { UserRoleEnum } from '../../../../common/enum/user-role.enum';
import { v4 as uuidv4 } from 'uuid';

@Table({ timestamps: true })
export class User extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Index({ unique: true })
  @Column({
    allowNull: false,
    type: DataType.STRING,
    validate: { isEmail: { msg: "User's email is required" } },
  })
  email: string;

  @Column({ type: DataType.CHAR(60), allowNull: false })
  password: string;

  @Column({
    type: DataType.STRING,
    validate: { notEmpty: { msg: 'Roles is required' } },
    defaultValue: UserRoleEnum.User,
  })
  role: UserRoleEnum;

  @Column({ type: DataType.CHAR(2), allowNull: true })
  country?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    validate: {
      is: {
        args: /^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
        msg: 'Not a valid phone number!',
      },
    },
  })
  phone?: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  twoFactorEnabled?: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  twoFactorVerified?: boolean;

  @Column({ type: DataType.STRING, allowNull: true })
  twoFactorSecret?: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BeforeCreate
  static async hashPassword(instance: User): Promise<void> {
    instance.id = uuidv4();
    if (instance.password) {
      const salt = await bcrypt.genSalt();
      instance.password = await bcrypt.hash(instance.password, salt);
    }
  }

  @BeforeBulkUpdate
  static async hashPasswordBulk({ attributes, fields }): Promise<void> {
    if (fields.includes('password')) {
      const salt = await bcrypt.genSalt();
      attributes.password = await bcrypt.hash(attributes.password, salt);
    }
  }

  async comparePassword(candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password.trim());
  }
}
