import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { CustomerAccountModel } from '../customers/customer-account.model';

export interface OtpAttributes {
  id: number;
  email: string;
  code: string;
  attempts: number;
  expiresAt: Date;
  verified: boolean;
  customerAccountId?: number | null;
}

export type OtpCreationAttributes = Optional<
  OtpAttributes,
  'id' | 'attempts' | 'verified' | 'customerAccountId'
>;

@Table({ tableName: 'otps', timestamps: true })
export class OtpModel
  extends Model<OtpAttributes, OtpCreationAttributes>
  implements OtpAttributes
{
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  code: string;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  attempts: number;

  @Column({ type: DataType.DATE, allowNull: false })
  expiresAt: Date;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  verified: boolean;

  @ForeignKey(() => CustomerAccountModel)
  @Column({ type: DataType.INTEGER, allowNull: true })
  customerAccountId?: number | null;

  @BelongsTo(() => CustomerAccountModel)
  customerAccount?: CustomerAccountModel;
}

