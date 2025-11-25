import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  ArrayNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class SendMailDto {
  @ApiProperty({ example: 'Quarterly Update' })
  @IsString()
  subject: string;

  @ApiProperty({
    description: 'Markdown content of the email',
    example: '# Hello\nThis is an update.',
  })
  @IsString()
  bodyMarkdown: string;

  @ApiProperty({
    description: 'Target customers by ID (comma-separated or array)',
    example: '1,2,3',
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((id) => parseInt(id.trim(), 10));
    }
    if (Array.isArray(value)) {
      return value.map((id) =>
        typeof id === 'number' ? id : parseInt(id, 10),
      );
    }
    return [parseInt(value, 10)];
  })
  @IsArray()
  @ArrayNotEmpty()
  customerIds: number[];

  @ApiProperty({
    description: 'Optional signature ID to append to the email',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  signatureId?: number;
}
