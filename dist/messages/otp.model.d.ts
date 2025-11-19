import { Model } from 'sequelize-typescript';
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
export type OtpCreationAttributes = Optional<OtpAttributes, 'id' | 'attempts' | 'verified' | 'customerAccountId'>;
export declare class OtpModel extends Model<OtpAttributes, OtpCreationAttributes> implements OtpAttributes {
    id: number;
    email: string;
    code: string;
    attempts: number;
    expiresAt: Date;
    verified: boolean;
    customerAccountId?: number | null;
    customerAccount?: CustomerAccountModel;
}
