export declare class UpdateUserDto {
    username?: string;
    password?: string;
    name?: string;
    role?: 'admin' | 'user' | 'manager';
    departmentId?: number;
}
