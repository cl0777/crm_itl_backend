import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateSignatureDto {
  @ApiProperty({
    example: 'Default Signature',
    description: 'Name/identifier for the signature',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Best regards,\nJohn Doe\nSales Manager',
    description: 'Markdown content of the signature',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: false,
    description: 'Whether this should be set as the default signature',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

