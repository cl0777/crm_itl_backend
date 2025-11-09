import { Model } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { CustomerModel } from './customer.model';
export interface CustomerAccountAttributes {
    id: number;
    customerId?: number | null;
    name: string;
    email: string;
    passwordHash: string;
}
export type CustomerAccountCreationAttributes = Optional<CustomerAccountAttributes, 'id' | 'customerId'>;
export declare class CustomerAccountModel extends Model<CustomerAccountAttributes, CustomerAccountCreationAttributes> implements CustomerAccountAttributes {
    id: number;
    customerId?: number | null;
    customer?: CustomerModel;
    name: string;
    email: string;
    passwordHash: string;
}
