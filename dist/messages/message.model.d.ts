import { Model } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { UserModel } from '../users/user.model';
export interface MessageAttributes {
    id: number;
    subject: string;
    bodyMarkdown: string;
    bodyHtml: string;
    fromEmail: string;
    toEmail: string;
    attachmentsJson?: string;
    status: 'queued' | 'sent' | 'failed';
    errorMessage?: string;
    userId: number;
    sentAt?: Date;
}
export type MessageCreationAttributes = Optional<MessageAttributes, 'id' | 'attachmentsJson' | 'errorMessage' | 'sentAt'>;
export declare class MessageModel extends Model<MessageAttributes, MessageCreationAttributes> implements MessageAttributes {
    id: number;
    subject: string;
    bodyMarkdown: string;
    bodyHtml: string;
    fromEmail: string;
    toEmail: string;
    attachmentsJson?: string;
    status: 'queued' | 'sent' | 'failed';
    errorMessage?: string;
    userId: number;
    user: UserModel;
    sentAt?: Date;
}
