import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(req: any, dto: CreateOrderDto): Promise<import("./order.model").OrderAttributes>;
    listMine(req: any): Promise<import("./order.model").OrderModel[]>;
}
