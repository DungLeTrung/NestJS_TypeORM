import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, IsArray, ValidateNested, IsOptional } from 'class-validator';

class OrderProductDto {
    @IsNotEmpty()
    id: string; 
  
    @IsNotEmpty()
    quantity: number; 
  }

export class CreateOrderDto {
    @IsString()
    @IsOptional()
    address?: string; 

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderProductDto)
    products: OrderProductDto[]; 
}
