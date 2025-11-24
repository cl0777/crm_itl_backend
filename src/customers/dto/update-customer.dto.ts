import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateCustomerDto {
  @ApiPropertyOptional({ example: 'ABC Corporation', description: 'Company name' })
  @IsOptional()
  @IsString()
  partyName?: string;

  @ApiPropertyOptional({ example: 'ABC Corp', description: 'Represented name' })
  @IsOptional()
  @IsString()
  shortname?: string;

  @ApiPropertyOptional({ example: '123 Main Street' })
  @IsOptional()
  @IsString()
  address1?: string;

  @ApiPropertyOptional({ example: 'Suite 400' })
  @IsOptional()
  @IsString()
  address2?: string;

  @ApiPropertyOptional({ example: 'New York' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'USA' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: 'contact@abccorp.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '+1-234-567-8900', description: 'Primary phone' })
  @IsOptional()
  @IsString()
  phone1?: string;

  @ApiPropertyOptional({ example: '+1-987-654-3210', description: 'Secondary phone' })
  @IsOptional()
  @IsString()
  phone2?: string;

  @ApiPropertyOptional({ example: 'Active' })
  @IsOptional()
  @IsString()
  status?: string;
}
