import { Model } from 'sequelize-typescript';
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
export declare class CustomerModel extends Model<CustomerAttributes, CustomerCreationAttributes> implements CustomerAttributes {
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
    user: UserModel;
}
