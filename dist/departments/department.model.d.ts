import { Model } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { UserModel } from '../users/user.model';
export interface DepartmentAttributes {
    id: number;
    name: string;
    description?: string;
    managerId?: number;
}
export type DepartmentCreationAttributes = Optional<DepartmentAttributes, 'id'>;
export declare class DepartmentModel extends Model<DepartmentAttributes, DepartmentCreationAttributes> implements DepartmentAttributes {
    id: number;
    name: string;
    description?: string;
    managerId?: number;
    manager: UserModel;
    users: UserModel[];
}
