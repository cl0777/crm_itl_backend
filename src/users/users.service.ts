import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from './user.model';
import { DepartmentModel } from '../departments/department.model';

export interface User {
  id: number;
  username: string;
  passwordHash: string;
  name: string;
  role: 'admin' | 'user' | 'manager';
  departmentId?: number;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: typeof UserModel,
    @InjectModel(DepartmentModel)
    private readonly departmentModel: typeof DepartmentModel,
  ) {}

  async createUser(
    username: string,
    password: string,
    name: string,
    role: 'admin' | 'user' | 'manager' = 'user',
    departmentId?: number,
  ): Promise<User> {
    const passwordHash = await bcrypt.hash(password, 10);
    const created = await this.userModel.create({
      username,
      passwordHash,
      name,
      role,
      departmentId,
    });
    return created.get({ plain: true }) as unknown as User;
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ where: { username } });
    return user ? (user.get({ plain: true }) as unknown as User) : undefined;
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    console.log('validateUser', username, password);
    const user = await this.findByUsername(username);
    if (!user) return null;
    const valid = await bcrypt.compare(password, user.passwordHash);
    return valid ? user : null;
  }

  async findMe(id: number): Promise<User | undefined> {
    const me = await this.userModel.findOne({
      where: { id: id },
      attributes: { exclude: ['passwordHash'] },
    });
    return me ? (me.get({ plain: true }) as unknown as User) : undefined;
  }

  async findAll(): Promise<Array<Omit<User, 'passwordHash'>>> {
    const users = await this.userModel.findAll();
    return users.map((u) => {
      const plain = u.get({ plain: true }) as unknown as User;
      const { passwordHash, ...rest } = plain;
      return rest;
    });
  }

  async findById(id: number): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.userModel.findByPk(id);
    if (!user) throw new NotFoundException('User not found');
    const plain = user.get({ plain: true }) as unknown as User;
    const { passwordHash, ...rest } = plain;
    return rest;
  }

  async findEntityById(id: number): Promise<User | undefined> {
    const user = await this.userModel.findByPk(id);
    return user ? (user.get({ plain: true }) as unknown as User) : undefined;
  }

  async findByDepartment(
    userId: number,
  ): Promise<Array<Omit<User, 'passwordHash'>>> {
    const user = await this.userModel.findByPk(userId);
    if (!user) throw new NotFoundException('User not found');
    const departmentId = user.departmentId;
    const users = await this.userModel.findAll({
      where: { departmentId },
      attributes: { exclude: ['passwordHash'] },
    });
    return users.map((u) => u.get({ plain: true }) as unknown as User);
  }

  async update(
    id: number,
    dto: {
      username?: string;
      password?: string;
      name?: string;
      role?: 'admin' | 'user' | 'manager';
      departmentId?: number;
    },
  ) {
    const user = await this.userModel.findByPk(id);
    if (!user) throw new NotFoundException('User not found');
    if (dto.username) user.username = dto.username;
    if (dto.name) user.name = dto.name;
    if (dto.role) user.role = dto.role as any;
    if (dto.departmentId) user.departmentId = dto.departmentId;
    if (dto.password) user.passwordHash = await bcrypt.hash(dto.password, 10);

    // If role is manager and departmentId is set, ensure user is assigned to that department
    if (dto.role === 'manager' && dto.departmentId) {
      user.departmentId = dto.departmentId;
    }
    await user.save();
    const department = await this.departmentModel.findByPk(dto.departmentId);
    if (department) {
      department.managerId = user.id;
      await department.save();
    }
    const plain = user.get({ plain: true }) as unknown as User;
    const { passwordHash, ...rest } = plain;
    return rest;
  }

  async remove(id: number): Promise<void> {
    const deleted = await this.userModel.destroy({ where: { id } });
    if (deleted === 0) throw new NotFoundException('User not found');
  }
}
