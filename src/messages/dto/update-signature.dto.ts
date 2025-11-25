import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateSignatureDto {
  @ApiProperty({
    example: 'Updated Signature Name',
    description: 'Name/identifier for the signature',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'Best regards,\nJohn Doe\nSales Manager',
    description: 'Markdown content of the signature',
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    example: true,
    description: 'Whether this should be set as the default signature',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

