import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Status } from 'src/config/const';
import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsString()
  @IsOptional()
  address?: string;

  @IsNumber()
  @IsOptional()
  total_price?: number;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
