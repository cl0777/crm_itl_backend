import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CustomerRegisterDto } from './dto/customer-register.dto';
import { CustomerLoginDto } from './dto/customer-login.dto';

@ApiTags('customers-auth')
@Controller({ path: 'customers/auth', version: '1' })
export class CustomersAuthController {
  constructor(private readonly customersService: CustomersService) {}

  @Post('register')
  @ApiOkResponse({ description: 'Register a new customer account' })
  async register(@Body() dto: CustomerRegisterDto) {
    return this.customersService.registerCustomer(dto);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOkResponse({ description: 'Login a customer and get tokens' })
  async login(@Body() dto: CustomerLoginDto) {
    return this.customersService.loginCustomer(dto);
  }
}
