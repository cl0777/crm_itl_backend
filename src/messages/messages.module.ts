import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { SignaturesController } from './signatures.controller';
import { SignaturesService } from './signatures.service';
import { MessageModel } from './message.model';
import { OtpModel } from './otp.model';
import { SignatureModel } from './signature.model';
import { CustomerModel } from '../customers/customer.model';
import { CustomerAccountModel } from '../customers/customer-account.model';
import { UserModel } from '../users/user.model';
import { CustomersModule } from '../customers/customers.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      MessageModel,
      OtpModel,
      SignatureModel,
      CustomerModel,
      CustomerAccountModel,
      UserModel,
    ]),
    CustomersModule,
    UsersModule,
  ],
  controllers: [MessagesController, SignaturesController],
  providers: [MessagesService, SignaturesService],
  exports: [MessagesService, SignaturesService],
})
export class MessagesModule {}
