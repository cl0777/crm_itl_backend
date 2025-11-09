import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
  BelongsTo,
} from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { UserModel } from '../users/user.model';

export interface CustomerAttributes {
  id: number;
  partyName: string;
  shortname: string;
  address1: string;
  address2?: string;
  address3?: string;
  city: string;
  country: string;
  email: string;
  phone1: string;
  phone2?: string;
  status: string;
  addedBy: string;
  userId: number;
}

export type CustomerCreationAttributes = Optional<CustomerAttributes, 'id'>;

@Table({ tableName: 'customers', timestamps: true })
export class CustomerModel
  extends Model<CustomerAttributes, CustomerCreationAttributes>
  implements CustomerAttributes
{
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  partyName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  shortname: string;

  @Column({ type: DataType.STRING, allowNull: false })
  address1: string;

  @Column({ type: DataType.STRING, allowNull: true })
  address2?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  address3?: string;

  @Column({ type: DataType.STRING, allowNull: false })
  city: string;

  @Column({ type: DataType.STRING, allowNull: false })
  country: string;

  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  phone1: string;

  @Column({ type: DataType.STRING, allowNull: true })
  phone2?: string;

  @Column({ type: DataType.STRING, allowNull: false })
  status: string;

  @Column({ type: DataType.STRING, allowNull: false })
  addedBy: string;

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @BelongsTo(() => UserModel)
  user: UserModel;
}
