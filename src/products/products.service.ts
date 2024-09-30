import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Role } from 'src/config/const';
import aqp from 'api-query-params';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(productData: Partial<Product>): Promise<Product> {
    try {
      const product = await this.productRepository.create({
        ...productData,
      });
  
      return await this.productRepository.save(product);
    } catch (error) {
      throw new BadRequestException("Could not create product", error.message);
    }
  }

  async findAll(currentPage?: number, limit?: number, qs?: string) {
    try {
      const { filter, sort } = aqp(qs);
      delete filter.page;
      delete filter.size;
      
      const isPaginationEnabled = currentPage && limit;
      let offset = 0;
      let defaultLimit = 0;
  
      if (isPaginationEnabled) {
        offset = (currentPage - 1) * limit;
        defaultLimit = limit;
      }
  
      if (isNaN(offset) || isNaN(defaultLimit)) {
        throw new Error("Provided 'skip' or 'limit' value is not a number.");
      }
  
      const totalItems = await this.productRepository.count({ where: filter });
      const totalPages = isPaginationEnabled ? Math.ceil(totalItems / limit) : 1;
  
      const result = await this.productRepository.find({
        where: filter,
        skip: isPaginationEnabled ? offset : undefined,
        take: isPaginationEnabled ? defaultLimit : undefined,
        order: sort,
      });
  
      return {
        result,
        records: {
          page: currentPage || 1,
          size: limit || totalItems,
          total_pages: totalPages,
          total_items: totalItems,
        },
      };
    } catch (error) {
      throw new Error(`Error in findAll: ${error.message}`);
    }
  }

  async findById(id: string): Promise<Product> {
    try {
      const product = await this.productRepository.findOne({ where: { id } });
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      return product;
    } catch (error) {
      throw new BadRequestException('Can not find product', error.message);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    try {
      const product = await this.productRepository.findOne({ where: { id } });
      if (!product) {
        throw new NotFoundException('Product not found');
      }
  
      Object.assign(product, updateProductDto);
      
      return this.productRepository.save(product);
    } catch (error) {
      throw new BadRequestException('Update unsuccessful', error.message)
    }
  }

  async delete(id: string): Promise<string> {
    try {
      const product = await this.productRepository.findOne({ where: { id } });
      if (!product) {
        throw new NotFoundException('Product not found');
      }
  
      await this.productRepository.remove(product);
      return "Product deleted successfully"
    } catch (error) {
      throw new BadRequestException('Delete unsuccessful', error.message)
    }
  }
}
