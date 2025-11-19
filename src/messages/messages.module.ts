import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MessageModel } from './message.model';
import { OtpModel } from './otp.model';
import { CustomerModel } from '../customers/customer.model';
import { CustomerAccountModel } from '../customers/customer-account.model';
import { CustomersModule } from '../customers/customers.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      MessageModel,
      OtpModel,
      CustomerModel,
      CustomerAccountModel,
    ]),
    CustomersModule,
    UsersModule,
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
