import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './customers/customers.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './users/users.service';
import { MessagesModule } from './messages/messages.module';
import { DepartmentsModule } from './departments/departments.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'root',
      database: process.env.DB_NAME || 'crm_itl',
      autoLoadModels: true,
      synchronize: true,
      sync: { alter: true },
      logging: false,
    }),
    CustomersModule,
    UsersModule,
    AuthModule,
    MessagesModule,
    DepartmentsModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly usersService: UsersService) {}

  async onModuleInit() {
    try {
      const existing = await this.usersService.findByUsername('admin_crm');
      if (!existing) {
        await this.usersService.createUser(
          'admin_crm',
          'admin_itl_crm',
          'Admin',
          'admin',
        );
        // eslint-disable-next-line no-console
        console.log('Default admin user created: admin_crm');
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to ensure default admin user:', e);
    }
  }
}
