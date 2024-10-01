import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsPositive } from 'class-validator';

export class PaginateDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  currentPage?: number;

  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';

  @IsOptional()
  filters?: Record<string, any>; 
}