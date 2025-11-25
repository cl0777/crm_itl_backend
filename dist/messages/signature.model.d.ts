import { Model } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { UserModel } from '../users/user.model';
export interface SignatureAttributes {
    id: number;
    name: string;
    content: string;
    contentHtml?: string;
    isDefault: boolean;
    userId: number;
}
export type SignatureCreationAttributes = Optional<SignatureAttributes, 'id' | 'contentHtml' | 'isDefault'>;
export declare class SignatureModel extends Model<SignatureAttributes, SignatureCreationAttributes> implements SignatureAttributes {
    id: number;
    name: string;
    content: string;
    contentHtml?: string;
    isDefault: boolean;
    userId: number;
    user: UserModel;
}
