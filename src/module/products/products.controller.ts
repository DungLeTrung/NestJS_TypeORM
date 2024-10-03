import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PaginateDto } from 'src/common/paginate.dto';
import { ResponseMessage } from 'src/decorator/customize';
import { Product } from '../../entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(201)
  @ResponseMessage('CREATE PRODUCT')
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return await this.productsService.create(createProductDto);
  }

  @Get()
  @HttpCode(201)
  @ResponseMessage('LIST PRODUCTS')
  async getAlls(@Query() paginateDto: PaginateDto): Promise<any> {
    return await this.productsService.findAll(paginateDto);
  }

  @Get(':id')
  @HttpCode(201)
  @ResponseMessage('GET PRODUCT BY ID')
  async findOne(@Param('id') id: string): Promise<Product> {
    return await this.productsService.findById(id);
  }

  @Put(':id')
  @HttpCode(201)
  @ResponseMessage('UPDATE PRODUCT')
  async updateUser(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return await this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(201)
  @ResponseMessage('DELETE PRODUCT')
  async delete(@Param('id') id: string): Promise<string> {
    return await this.productsService.delete(id);
  }
}
