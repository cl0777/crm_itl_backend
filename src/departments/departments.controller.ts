import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { DepartmentsService } from './departments.service';

@ApiTags('departments')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'departments', version: '1' })
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  @ApiOkResponse({ description: 'List departments' })
  async findAll(@Req() req: any) {
    const userRole = req.user?.role;
    const userDepartmentId = req.user?.departmentId;
    return this.departmentsService.findAll(userRole, userDepartmentId);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Get department by id' })
  async findOne(@Param('id') id: string) {
    return this.departmentsService.findOne(Number(id));
  }

  @Post()
  @Roles('admin')
  @ApiOkResponse({ description: 'Create department (Admin only)' })
  async create(
    @Body() body: { name: string; description?: string; managerId?: number },
  ) {
    return this.departmentsService.create(
      body.name,
      body.description,
      body.managerId,
    );
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOkResponse({ description: 'Update department (Admin only)' })
  async update(
    @Param('id') id: string,
    @Body() body: { name?: string; description?: string; managerId?: number },
  ) {
    return this.departmentsService.update(Number(id), body);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOkResponse({ description: 'Delete department (Admin only)' })
  async remove(@Param('id') id: string) {
    await this.departmentsService.remove(Number(id));
    return { success: true };
  }
}
