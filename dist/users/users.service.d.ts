import { UserModel } from './user.model';
import { DepartmentModel } from '../departments/department.model';
export interface User {
    id: number;
    email: string;
    username: string;
    passwordHash: string;
    name: string;
    role: 'admin' | 'user' | 'manager';
    departmentId?: number;
}
export declare class UsersService {
    private readonly userModel;
    private readonly departmentModel;
    constructor(userModel: typeof UserModel, departmentModel: typeof DepartmentModel);
    createUser(email: string, username: string, password: string, name: string, role?: 'admin' | 'user' | 'manager', departmentId?: number): Promise<User>;
    findByUsername(username: string): Promise<User | undefined>;
    validateUser(username: string, password: string): Promise<User | null>;
    findMe(id: number): Promise<User | undefined>;
    findAll(): Promise<Array<Omit<User, 'passwordHash'>>>;
    findById(id: number): Promise<Omit<User, 'passwordHash'>>;
    findEntityById(id: number): Promise<User | undefined>;
    findByDepartment(userId: number): Promise<Array<Omit<User, 'passwordHash'>>>;
    update(id: number, dto: {
        email?: string;
        username?: string;
        password?: string;
        name?: string;
        role?: 'admin' | 'user' | 'manager';
        departmentId?: number;
    }): Promise<{
        id: number;
        email: string;
        username: string;
        name: string;
        role: "admin" | "user" | "manager";
        departmentId?: number;
    }>;
    remove(id: number): Promise<void>;
}
