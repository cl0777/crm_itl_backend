import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('users')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({ description: 'List users' })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get('department')
  @ApiOkResponse({ description: 'Get users from my department' })
  async getDepartmentUsers(@Req() req: any) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedException('User is not assigned to a department');
    }
    return this.usersService.findByDepartment(userId);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Get user by id' })
  @Roles('admin')
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(Number(id));
  }

  @Post()
  @ApiOkResponse({ description: 'Create user' })
  @Roles('admin')
  async create(@Body() dto: CreateUserDto) {
    const user = await this.usersService.createUser(
      dto.username,
      dto.password,
      dto.name,
      dto.role ?? 'user',
      dto.departmentId,
    );
    return {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      departmentId: user.departmentId,
    };
  }

  @Patch('me')
  @ApiOkResponse({ description: 'Update current user' })
  async updateMe(@Req() req: any, @Body() dto: UpdateUserDto) {
    const userId = req.user?.userId;
    if (!userId || isNaN(Number(userId))) {
      throw new UnauthorizedException('Invalid user ID');
    }
    return this.usersService.update(Number(userId), dto);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Update user' })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(Number(id), dto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Delete user' })
  @Roles('admin')
  async remove(@Param('id') id: string) {
    await this.usersService.remove(Number(id));
    return { success: true };
  }
}
