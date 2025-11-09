import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    private readonly usersService;
    constructor(authService: AuthService, usersService: UsersService);
    login(body: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    } | {
        message: string;
    }>;
    me(req: any): Promise<import("../users/users.service").User | undefined>;
    refresh(req: any): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
