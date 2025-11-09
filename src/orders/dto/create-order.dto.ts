import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateOrderDto {
  // Shipment route
  @ApiProperty({ description: 'Origin city', example: 'New York' })
  @IsNotEmpty()
  @IsString()
  originCity: string;

  @ApiProperty({ description: 'Origin country', example: 'USA' })
  @IsNotEmpty()
  @IsString()
  originCountry: string;

  @ApiProperty({ description: 'Destination city', example: 'London' })
  @IsNotEmpty()
  @IsString()
  destinationCity: string;

  @ApiProperty({ description: 'Destination country', example: 'UK' })
  @IsNotEmpty()
  @IsString()
  destinationCountry: string;

  // Shipment details
  @ApiProperty({ description: 'Weight in kg', example: 12.5 })
  @IsNumber()
  @Min(0)
  weightKg: number;

  @ApiProperty({ description: 'Shipment type', example: 'air' })
  @IsNotEmpty()
  @IsString()
  shipmentType: string;

  // Dimensions (optional)
  @ApiProperty({ required: false, description: 'Length in cm', example: 40 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  lengthCm?: number;

  @ApiProperty({ required: false, description: 'Width in cm', example: 30 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  widthCm?: number;

  @ApiProperty({ required: false, description: 'Height in cm', example: 25 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  heightCm?: number;

  // Declared value (optional)
  @ApiProperty({
    required: false,
    description: 'Declared value in USD',
    example: 150.0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  declaredValueUsd?: number;

  // Optional extra info
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalAmount?: number;

  @ApiProperty({
    required: false,
    description: 'Requested timeline text',
    example: 'Express',
  })
  @IsOptional()
  @IsString()
  timeline?: string;
}
