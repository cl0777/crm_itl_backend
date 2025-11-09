import { ApiProperty } from '@nestjs/swagger';

export class ImportCustomersDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
