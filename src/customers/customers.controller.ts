import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { UsersService } from '../users/users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ImportCustomersDto } from './dto/import-customers.dto';

@ApiTags('customers')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'customers', version: '1' })
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @ApiOkResponse({ description: 'Create customer' })
  async create(@Body() dto: CreateCustomerDto, @Req() req: any) {
    const user = await this.usersService.findEntityById(req.user.userId);
    const addedByName = user?.name || 'Unknown';
    return this.customersService.create(dto, req.user.userId, addedByName);
  }

  @Get()
  @ApiOkResponse({ description: 'List all customers' })
  async findAll(@Req() req: any) {
    const userRole = req.user?.role;
    const userId = userRole === 'admin' ? undefined : req.user?.userId;
    const userDepartmentId = req.user?.departmentId;
    return this.customersService.findAll(userId, userRole, userDepartmentId);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Get customer by id' })
  async findOne(@Param('id') id: string, @Req() req: any) {
    const userRole = req.user?.role;
    const userId = userRole === 'admin' ? undefined : req.user?.userId;
    return this.customersService.findOne(Number(id), userId);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Update customer' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCustomerDto,
    @Req() req: any,
  ) {
    const userRole = req.user?.role;
    const userId = userRole === 'admin' ? undefined : req.user?.userId;
    return this.customersService.update(Number(id), dto, userId);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Delete customer' })
  async remove(@Param('id') id: string, @Req() req: any) {
    const userRole = req.user?.role;
    const userId = userRole === 'admin' ? undefined : req.user?.userId;
    await this.customersService.remove(Number(id), userId);
    return { success: true };
  }

  @Post('import')
  @ApiOkResponse({ description: 'Import customers from XLSX' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: ImportCustomersDto })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: (_req, file, cb) => {
        const allowed = [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
        ];
        if (allowed.includes(file.mimetype)) return cb(null, true);
        return cb(null, false);
      },
    }),
  )
  async import(@UploadedFile() file: any, @Req() req: any) {
    const user = await this.usersService.findEntityById(req.user.userId);
    const addedByName = user?.name || 'Unknown';
    return this.customersService.importFromXlsx(
      file?.buffer || Buffer.alloc(0),
      req.user.userId,
      addedByName,
    );
  }
}
