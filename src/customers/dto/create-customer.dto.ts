import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ example: 'ABC Corporation' })
  @IsNotEmpty()
  @IsString()
  partyName: string;

  @ApiProperty({ example: 'ABC Corp' })
  @IsNotEmpty()
  @IsString()
  shortname: string;

  @ApiProperty({ example: '123 Main Street' })
  @IsNotEmpty()
  @IsString()
  address1: string;

  @ApiProperty({ example: 'Suite 400', required: false })
  @IsString()
  address2?: string;

  @ApiProperty({ example: 'Building B', required: false })
  @IsString()
  address3?: string;

  @ApiProperty({ example: 'New York' })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ example: 'USA' })
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty({ example: 'contact@abccorp.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+1-234-567-8900' })
  @IsNotEmpty()
  @IsString()
  phone1: string;

  @ApiProperty({ example: '+1-987-654-3210', required: false })
  @IsString()
  phone2?: string;

  @ApiProperty({ example: 'Active' })
  @IsNotEmpty()
  @IsString()
  status: string;
}
