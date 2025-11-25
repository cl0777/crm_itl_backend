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

export interface SignatureAttributes {
  id: number;
  name: string; // Name/identifier for the signature (e.g., "Default", "Formal", "Sales")
  content: string; // Markdown content of the signature
  contentHtml?: string; // HTML version (can be auto-generated)
  isDefault: boolean; // Whether this is the default signature for the user
  userId: number; // Owner of the signature
}

export type SignatureCreationAttributes = Optional<
  SignatureAttributes,
  'id' | 'contentHtml' | 'isDefault'
>;

@Table({ tableName: 'signatures', timestamps: true })
export class SignatureModel
  extends Model<SignatureAttributes, SignatureCreationAttributes>
  implements SignatureAttributes
{
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  content: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  contentHtml?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isDefault: boolean;

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @BelongsTo(() => UserModel)
  user: UserModel;
}

