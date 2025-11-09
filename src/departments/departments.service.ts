import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DepartmentModel } from './department.model';
import { UserModel } from '../users/user.model';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectModel(DepartmentModel)
    private readonly departmentModel: typeof DepartmentModel,
    @InjectModel(UserModel)
    private readonly userModel: typeof UserModel,
  ) {}

  async findAll(userRole?: string, userDepartmentId?: number) {
    if (userRole === 'admin') {
      return this.departmentModel.findAll();
    } else if (userRole === 'manager' && userDepartmentId) {
      return this.departmentModel.findAll({
        where: { id: userDepartmentId },
      });
    } else {
      return [];
    }
  }

  async findOne(id: number) {
    const department = await this.departmentModel.findByPk(id);
    if (!department) {
      throw new NotFoundException('Department not found');
    }
    return department;
  }

  async create(name: string, description?: string, managerId?: number) {
    const department = await this.departmentModel.create({
      name,
      description,
      managerId,
    });

    // If managerId is set, automatically assign that user to this department
    if (managerId) {
      const manager = await this.userModel.findByPk(managerId);
      if (manager) {
        manager.departmentId = department.id;
        await manager.save();
      }
    }

    return department;
  }

  async update(
    id: number,
    dto: { name?: string; description?: string; managerId?: number },
  ) {
    const department = await this.departmentModel.findByPk(id);
    if (!department) {
      throw new NotFoundException('Department not found');
    }
    if (dto.name) department.name = dto.name;
    if (dto.description !== undefined) department.description = dto.description;
    if (dto.managerId !== undefined) department.managerId = dto.managerId;
    await department.save();

    // If managerId changed, automatically assign that user to this department
    if (dto.managerId !== undefined) {
      const manager = await this.userModel.findByPk(dto.managerId);
      if (manager) {
        manager.departmentId = department.id;
        await manager.save();
      }
    }

    return department;
  }

  async remove(id: number) {
    const deleted = await this.departmentModel.destroy({ where: { id } });
    if (deleted === 0) {
      throw new NotFoundException('Department not found');
    }
  }
}
