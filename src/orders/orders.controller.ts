import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@ApiTags('orders')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'orders', version: '1' })
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOkResponse({ description: 'Create a new order (customer only)' })
  async create(@Req() req: any, @Body() dto: CreateOrderDto) {
    if (req.user?.role !== 'customer') {
      // Only customer tokens can use this endpoint
      throw new ForbiddenException('Only customers can create orders');
    }
    return this.ordersService.createForCustomer(req.user.userId, dto);
  }

  @Get()
  @ApiOkResponse({ description: 'List my orders (customer only)' })
  async listMine(@Req() req: any) {
    if (req.user?.role !== 'customer') {
      throw new ForbiddenException('Only customers can list their orders');
    }
    return this.ordersService.listForCustomer(req.user.userId);
  }
}
