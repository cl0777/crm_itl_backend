import { Column, DataType, Model, Table, HasMany, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { UserModel } from '../users/user.model';

export interface DepartmentAttributes {
  id: number;
  name: string;
  description?: string;
  managerId?: number;
}

export type DepartmentCreationAttributes = Optional<DepartmentAttributes, 'id'>;

@Table({ tableName: 'departments', timestamps: true })
export class DepartmentModel
  extends Model<DepartmentAttributes, DepartmentCreationAttributes>
  implements DepartmentAttributes
{
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  name: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  description?: string;

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.INTEGER, allowNull: true })
  managerId?: number;

  @BelongsTo(() => UserModel, 'managerId')
  manager: UserModel;

  @HasMany(() => UserModel)
  users: UserModel[];
}
