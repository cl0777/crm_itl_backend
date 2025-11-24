import { CustomerModel } from './customer.model';
import { CustomerAccountModel } from './customer-account.model';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { JwtService } from '@nestjs/jwt';
import { CustomerRegisterDto } from './dto/customer-register.dto';
import { CustomerLoginDto } from './dto/customer-login.dto';
export declare class CustomersService {
    private readonly customerModel;
    private readonly customerAccountModel;
    private readonly jwtService;
    constructor(customerModel: typeof CustomerModel, customerAccountModel: typeof CustomerAccountModel, jwtService: JwtService);
    create(dto: CreateCustomerDto, userId: number, addedByName: string): Promise<import("./customer.model").CustomerAttributes>;
    registerCustomer(dto: CustomerRegisterDto): Promise<{
        accessToken: string;
        account: {
            id: number;
            name: string;
            email: string;
        };
    }>;
    loginCustomer(dto: CustomerLoginDto): Promise<{
        accessToken: string;
        account: {
            id: number;
            name: string;
            email: string;
        };
    }>;
    private issueTokensForCustomer;
    findAll(userId?: number, userRole?: string, userDepartmentId?: number): Promise<CustomerModel[]>;
    getCount(userId?: number, userRole?: string, userDepartmentId?: number): Promise<number>;
    findOne(id: number, userId?: number, userRole?: string): Promise<import("./customer.model").CustomerAttributes>;
    update(id: number, dto: UpdateCustomerDto, userId?: number, userRole?: string): Promise<import("./customer.model").CustomerAttributes>;
    remove(id: number, userId?: number, userRole?: string): Promise<void>;
    importFromXlsx(fileBuffer: Buffer, userId: number, addedByName: string): Promise<{
        count: number;
        items: any[];
    }>;
}
