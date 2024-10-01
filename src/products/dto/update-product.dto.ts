import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ArrayNotEmpty, IsArray, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';
import { Category } from 'src/categories/entities/category.entity';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  stock: number;

  @IsArray()
  @IsString({ each: true }) 
  categories: string[];
}
