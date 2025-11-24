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
  partyName: string; // Company name (kept for DB compatibility)
  shortname: string; // Represented name (kept for DB compatibility)
  address1: string;
  address2?: string;
  city: string;
  country: string;
  email: string;
  phone1: string; // Primary phone (kept for DB compatibility)
  phone2?: string; // Secondary phone (kept for DB compatibility)
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
  partyName: string; // Company name

  @Column({ type: DataType.STRING, allowNull: false })
  shortname: string; // Represented name

  @Column({ type: DataType.STRING, allowNull: false })
  address1: string;

  @Column({ type: DataType.STRING, allowNull: true })
  address2?: string;

  @Column({ type: DataType.STRING, allowNull: false })
  city: string;

  @Column({ type: DataType.STRING, allowNull: false })
  country: string;

  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  phone1: string; // Primary phone

  @Column({ type: DataType.STRING, allowNull: true })
  phone2?: string; // Secondary phone

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
