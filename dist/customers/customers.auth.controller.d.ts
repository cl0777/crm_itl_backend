import { CustomersService } from './customers.service';
import { CustomerRegisterDto } from './dto/customer-register.dto';
import { CustomerLoginDto } from './dto/customer-login.dto';
export declare class CustomersAuthController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    register(dto: CustomerRegisterDto): Promise<{
        accessToken: string;
        account: {
            id: number;
            name: string;
            email: string;
        };
    }>;
    login(dto: CustomerLoginDto): Promise<{
        accessToken: string;
        account: {
            id: number;
            name: string;
            email: string;
        };
    }>;
}
