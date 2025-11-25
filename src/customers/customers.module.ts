import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { CustomersController } from './customers.controller';
import { CustomersAuthController } from './customers.auth.controller';
import { CustomersService } from './customers.service';
import { CustomerModel } from './customer.model';
import { CustomerAccountModel } from './customer-account.model';
import { UserModel } from '../users/user.model';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    SequelizeModule.forFeature([CustomerModel, CustomerAccountModel, UserModel]),
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev_jwt_secret_change_me',
      signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [CustomersController, CustomersAuthController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
