import { JwtService } from '@nestjs/jwt';
import { UsersService, User } from '../users/users.service';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    issueTokens(user: User): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
