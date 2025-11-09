import { OnModuleInit } from '@nestjs/common';
import { UsersService } from './users/users.service';
export declare class AppModule implements OnModuleInit {
    private readonly usersService;
    constructor(usersService: UsersService);
    onModuleInit(): Promise<void>;
}
