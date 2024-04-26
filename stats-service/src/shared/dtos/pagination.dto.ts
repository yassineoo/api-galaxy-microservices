import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationFiltersDto {
  @ApiProperty({ required: true, example: 1, type: Number })
  @IsDefined()
  page = 1;

  @IsOptional()
  @ApiPropertyOptional({ example: 20, type: Number })
  @IsDefined()
  limit = 5;

  // @IsOptional()
  // @ApiPropertyOptional({ example: 20 })
  // @IsDefined()
  // pageSize = 5;
}
