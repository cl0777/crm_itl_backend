export declare class UpdateUserDto {
    email?: string;
    username?: string;
    password?: string;
    name?: string;
    role?: 'admin' | 'user' | 'manager';
    departmentId?: number;
}
