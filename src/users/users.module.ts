import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserModel } from './user.model';
import { DepartmentModel } from '../departments/department.model';

@Module({
  imports: [SequelizeModule.forFeature([UserModel, DepartmentModel])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
