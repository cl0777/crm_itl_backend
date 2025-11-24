import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ example: 'ABC Corporation', description: 'Company name' })
  @IsNotEmpty()
  @IsString()
  partyName: string;

  @ApiProperty({ example: 'ABC Corp', description: 'Represented name' })
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

  @ApiProperty({ example: '+1-234-567-8900', description: 'Primary phone' })
  @IsNotEmpty()
  @IsString()
  phone1: string;

  @ApiProperty({ example: '+1-987-654-3210', required: false, description: 'Secondary phone' })
  @IsOptional()
  @IsString()
  phone2?: string;

  @ApiProperty({ example: 'Active' })
  @IsNotEmpty()
  @IsString()
  status: string;
}
