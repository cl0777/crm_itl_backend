import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<Omit<import("./users.service").User, "passwordHash">[]>;
    getDepartmentUsers(req: any): Promise<Omit<import("./users.service").User, "passwordHash">[]>;
    findOne(id: string): Promise<Omit<import("./users.service").User, "passwordHash">>;
    create(dto: CreateUserDto): Promise<{
        id: number;
        username: string;
        name: string;
        role: "admin" | "user" | "manager";
        departmentId: number | undefined;
    }>;
    updateMe(req: any, dto: UpdateUserDto): Promise<{
        id: number;
        username: string;
        name: string;
        role: "admin" | "user" | "manager";
        departmentId?: number;
    }>;
    update(id: string, dto: UpdateUserDto): Promise<{
        id: number;
        username: string;
        name: string;
        role: "admin" | "user" | "manager";
        departmentId?: number;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
