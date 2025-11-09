import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { UsersService } from '../users/users.service';
export declare class CustomersController {
    private readonly customersService;
    private readonly usersService;
    constructor(customersService: CustomersService, usersService: UsersService);
    create(dto: CreateCustomerDto, req: any): Promise<import("./customer.model").CustomerAttributes>;
    findAll(req: any): Promise<import("./customer.model").CustomerModel[]>;
    findOne(id: string, req: any): Promise<import("./customer.model").CustomerAttributes>;
    update(id: string, dto: UpdateCustomerDto, req: any): Promise<import("./customer.model").CustomerAttributes>;
    remove(id: string, req: any): Promise<{
        success: boolean;
    }>;
    import(file: any, req: any): Promise<{
        count: number;
        items: any[];
    }>;
}
