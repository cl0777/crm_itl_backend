import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { CustomerAccountModel } from '../customers/customer-account.model';

export interface OrderAttributes {
  id: number;
  customerAccountId: number;
  description?: string;
  status: 'pending' | 'confirmed' | 'canceled';
  totalAmount?: number | null;
  // Route
  originCity: string;
  originCountry: string;
  destinationCity: string;
  destinationCountry: string;
  // Shipment
  weightKg: number;
  shipmentType: string;
  // Dimensions
  lengthCm?: number | null;
  widthCm?: number | null;
  heightCm?: number | null;
  // Declared value
  declaredValueUsd?: number | null;
  // Timeline
  timeline?: string | null;
}

export type OrderCreationAttributes = Optional<
  OrderAttributes,
  | 'id'
  | 'description'
  | 'totalAmount'
  | 'status'
  | 'lengthCm'
  | 'widthCm'
  | 'heightCm'
  | 'declaredValueUsd'
  | 'timeline'
>;

@Table({ tableName: 'orders', timestamps: true })
export class OrderModel
  extends Model<OrderAttributes, OrderCreationAttributes>
  implements OrderAttributes
{
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @ForeignKey(() => CustomerAccountModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  customerAccountId: number;

  @BelongsTo(() => CustomerAccountModel)
  customerAccount: CustomerAccountModel;

  @Column({ type: DataType.TEXT, allowNull: true })
  description?: string;

  @Column({
    type: DataType.ENUM('pending', 'confirmed', 'canceled'),
    allowNull: false,
    defaultValue: 'pending',
  })
  status: 'pending' | 'confirmed' | 'canceled';

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: true })
  totalAmount?: number | null;

  // Route
  @Column({ type: DataType.STRING, allowNull: false })
  originCity: string;

  @Column({ type: DataType.STRING, allowNull: false })
  originCountry: string;

  @Column({ type: DataType.STRING, allowNull: false })
  destinationCity: string;

  @Column({ type: DataType.STRING, allowNull: false })
  destinationCountry: string;

  // Shipment
  @Column({ type: DataType.DECIMAL(12, 3), allowNull: false })
  weightKg: number;

  @Column({ type: DataType.STRING, allowNull: false })
  shipmentType: string;

  // Dimensions
  @Column({ type: DataType.DECIMAL(12, 2), allowNull: true })
  lengthCm?: number | null;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: true })
  widthCm?: number | null;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: true })
  heightCm?: number | null;

  // Declared value
  @Column({ type: DataType.DECIMAL(12, 2), allowNull: true })
  declaredValueUsd?: number | null;

  // Timeline
  @Column({ type: DataType.STRING, allowNull: true })
  timeline?: string | null;
}
