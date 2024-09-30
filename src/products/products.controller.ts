import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ResponseMessage } from 'src/decorator/customize';
import { Product } from './entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ResponseMessage("CREATE PRODUCT")
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ResponseMessage('LIST PRODUCTS')
  findAll(
    @Query('page') currentPage: string,
    @Query('limit') limit: string,
    @Query() qs: string,
  ) {
    return this.productsService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('GET PRODUCT BY ID')
  findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findById(id); 
  }

  @Put(':id')
  @ResponseMessage('UPDATE PRODUCT')
  updateUser(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto): Promise<Product> {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ResponseMessage('DELETE PRODUCT')
  delete(
    @Param('id') id: string
  ) : Promise<string> {
    return this.productsService.delete(id);
  }
}
