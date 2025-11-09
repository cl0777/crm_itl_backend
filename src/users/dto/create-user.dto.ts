import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'john_doe' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ minLength: 6 })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ enum: ['admin', 'user', 'manager'], default: 'user' })
  @IsOptional()
  @IsIn(['admin', 'user', 'manager'])
  role?: 'admin' | 'user' | 'manager';

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  departmentId?: number;
}
