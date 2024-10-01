import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';
import { Category } from 'src/categories/entities/category.entity';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
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
