import { OrderModel } from './order.model';
import { CreateOrderDto } from './dto/create-order.dto';
import { MessagesService } from '../messages/messages.service';
import { UserModel } from '../users/user.model';
export declare class OrdersService {
    private readonly orderModel;
    private readonly userModel;
    private readonly messagesService;
    constructor(orderModel: typeof OrderModel, userModel: typeof UserModel, messagesService: MessagesService);
    createForCustomer(customerAccountId: number, dto: CreateOrderDto): Promise<import("./order.model").OrderAttributes>;
    listForCustomer(customerAccountId: number): Promise<OrderModel[]>;
}
