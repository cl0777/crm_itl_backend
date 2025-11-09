import { Model } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { CustomerAccountModel } from '../customers/customer-account.model';
export interface OrderAttributes {
    id: number;
    customerAccountId: number;
    description?: string;
    status: 'pending' | 'confirmed' | 'canceled';
    totalAmount?: number | null;
    originCity: string;
    originCountry: string;
    destinationCity: string;
    destinationCountry: string;
    weightKg: number;
    shipmentType: string;
    lengthCm?: number | null;
    widthCm?: number | null;
    heightCm?: number | null;
    declaredValueUsd?: number | null;
    timeline?: string | null;
}
export type OrderCreationAttributes = Optional<OrderAttributes, 'id' | 'description' | 'totalAmount' | 'status' | 'lengthCm' | 'widthCm' | 'heightCm' | 'declaredValueUsd' | 'timeline'>;
export declare class OrderModel extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
    id: number;
    customerAccountId: number;
    customerAccount: CustomerAccountModel;
    description?: string;
    status: 'pending' | 'confirmed' | 'canceled';
    totalAmount?: number | null;
    originCity: string;
    originCountry: string;
    destinationCity: string;
    destinationCountry: string;
    weightKg: number;
    shipmentType: string;
    lengthCm?: number | null;
    widthCm?: number | null;
    heightCm?: number | null;
    declaredValueUsd?: number | null;
    timeline?: string | null;
}
