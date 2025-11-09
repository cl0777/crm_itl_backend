import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderModel } from './order.model';
import { CustomerAccountModel } from '../customers/customer-account.model';
import { MessagesModule } from '../messages/messages.module';
import { UserModel } from '../users/user.model';
import { CustomerModel } from '../customers/customer.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      OrderModel,
      CustomerAccountModel,
      CustomerModel,
      UserModel,
    ]),
    MessagesModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
