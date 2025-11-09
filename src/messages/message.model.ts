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

export interface MessageAttributes {
  id: number;
  subject: string;
  bodyMarkdown: string;
  bodyHtml: string;
  fromEmail: string;
  toEmail: string;
  attachmentsJson?: string; // JSON array of filenames or metadata
  status: 'queued' | 'sent' | 'failed';
  errorMessage?: string;
  userId: number; // sender
  sentAt?: Date;
}

export type MessageCreationAttributes = Optional<
  MessageAttributes,
  'id' | 'attachmentsJson' | 'errorMessage' | 'sentAt'
>;

@Table({ tableName: 'messages', timestamps: true })
export class MessageModel
  extends Model<MessageAttributes, MessageCreationAttributes>
  implements MessageAttributes
{
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  subject: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  bodyMarkdown: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  bodyHtml: string;

  @Column({ type: DataType.STRING, allowNull: false })
  fromEmail: string;

  @Column({ type: DataType.STRING, allowNull: false })
  toEmail: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  attachmentsJson?: string;

  @Column({
    type: DataType.ENUM('queued', 'sent', 'failed'),
    allowNull: false,
    defaultValue: 'queued',
  })
  status: 'queued' | 'sent' | 'failed';

  @Column({ type: DataType.TEXT, allowNull: true })
  errorMessage?: string;

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @BelongsTo(() => UserModel)
  user: UserModel;

  @Column({ type: DataType.DATE, allowNull: true })
  sentAt?: Date;
}
