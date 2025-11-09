import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsInt,
  IsString,
} from 'class-validator';

export class CustomerRegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ required: false, description: 'Link to existing customer id' })
  @IsOptional()
  @IsInt()
  customerId?: number;

  // Required customer profile fields for registration
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
  @IsOptional()
  @IsString()
  address2?: string;

  @ApiProperty({ example: 'Building B', required: false })
  @IsOptional()
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

  @ApiProperty({ example: '+1-234-567-8900' })
  @IsNotEmpty()
  @IsString()
  phone1: string;

  @ApiProperty({ example: '+1-987-654-3210', required: false })
  @IsOptional()
  @IsString()
  phone2?: string;
}
