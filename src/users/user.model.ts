import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { DepartmentModel } from '../departments/department.model';

export interface UserAttributes {
  id: number;
  email: string;
  username: string;
  passwordHash: string;
  name: string;
  role: 'admin' | 'user' | 'manager';
  departmentId?: number;
}

export type UserCreationAttributes = Optional<
  UserAttributes,
  'id' | 'departmentId'
>;

@Table({ tableName: 'users', timestamps: true })
export class UserModel
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  username: string;

  @Column({ type: DataType.STRING, allowNull: false })
  passwordHash: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({
    type: DataType.ENUM('admin', 'user', 'manager'),
    allowNull: false,
    defaultValue: 'user',
  })
  role: 'admin' | 'user' | 'manager';

  @ForeignKey(() => DepartmentModel)
  @Column({ type: DataType.INTEGER, allowNull: true })
  departmentId?: number;

  @BelongsTo(() => DepartmentModel)
  department: DepartmentModel;
}
