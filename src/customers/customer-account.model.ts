import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
  BelongsTo,
  Unique,
} from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { CustomerModel } from './customer.model';

export interface CustomerAccountAttributes {
  id: number;
  customerId?: number | null;
  name: string;
  email: string;
  passwordHash: string;
}

export type CustomerAccountCreationAttributes = Optional<
  CustomerAccountAttributes,
  'id' | 'customerId'
>;

@Table({ tableName: 'customer_accounts', timestamps: true })
export class CustomerAccountModel
  extends Model<CustomerAccountAttributes, CustomerAccountCreationAttributes>
  implements CustomerAccountAttributes
{
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @ForeignKey(() => CustomerModel)
  @Column({ type: DataType.INTEGER, allowNull: true })
  customerId?: number | null;

  @BelongsTo(() => CustomerModel)
  customer?: CustomerModel;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Unique
  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  passwordHash: string;
}
