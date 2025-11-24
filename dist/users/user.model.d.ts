import { Model } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { DepartmentModel } from '../departments/department.model';
export interface UserAttributes {
    id: number;
    username: string;
    passwordHash: string;
    name: string;
    role: 'admin' | 'user' | 'manager';
    departmentId?: number;
}
export type UserCreationAttributes = Optional<UserAttributes, 'id' | 'departmentId'>;
export declare class UserModel extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    id: number;
    username: string;
    passwordHash: string;
    name: string;
    role: 'admin' | 'user' | 'manager';
    departmentId?: number;
    department: DepartmentModel;
}
