import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MessageModel } from './message.model';
import { CustomerModel } from '../customers/customer.model';
import { CustomersModule } from '../customers/customers.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    SequelizeModule.forFeature([MessageModel, CustomerModel]),
    CustomersModule,
    UsersModule,
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
