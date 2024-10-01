import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginateDto } from 'src/common/paginate.dto';
import { In, Like, Repository } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Category } from 'src/entities';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(productData: CreateProductDto): Promise<Product> {
    try {
      const { categories, ...rest } = productData;

      if (!categories || categories.length === 0) {
        throw new BadRequestException('At least one category is required');
      }

      const categoryEntities = await this.categoryRepository.find({
        where: { id: In(categories) },
      });

      if (categoryEntities.length !== categories.length) {
        throw new BadRequestException('One or more categories are invalid');
      }

      const existingProduct = await this.productRepository.findOne({
        where: { name: rest.name },
      });

      if (existingProduct) {
        throw new BadRequestException('Product with this name already exists');
      }

      const product = this.productRepository.create({
        ...rest,
        categories: categoryEntities,
      });

      return await this.productRepository.save(product);
    } catch (error) {
      throw new BadRequestException('Could not create product', error.message);
    }
  }

  async findAll(paginateDto: PaginateDto) {
    try {
      const {
        currentPage,
        limit,
        sortBy = 'id',
        sortOrder = 'ASC',
        filters = {},
      } = paginateDto;

      const filterConditions = {};

      if (filters && typeof filters === 'object') {
        for (const [key, value] of Object.entries(filters)) {
          if (typeof value === 'string') {
            filterConditions[key] = Like(`%${value}%`);
          } else {
            filterConditions[key] = value;
          }
        }
      }

      const isPaginationEnabled = !!currentPage && !!limit;
      let offset = 0;
      let defaultLimit = 0;

      if (isPaginationEnabled) {
        offset = (currentPage - 1) * limit;
        defaultLimit = limit;

        if (isNaN(offset) || isNaN(defaultLimit)) {
          throw new BadRequestException(
            "Provided 'skip' or 'limit' value is not a number.",
          );
        }
      }

      const totalItems = await this.productRepository.count({
        where: filterConditions,
      });
      const totalPages = Math.ceil(totalItems / limit);

      const result = await this.productRepository.find({
        where: filterConditions,
        skip: offset,
        take: limit,
        order: {
          [sortBy]: sortOrder,
        },
      });

      return {
        result,
        records: {
          currentPage,
          limit,
          totalPages,
          totalItems,
        },
      };
    } catch (error) {
      throw new BadRequestException(`Error in findAll: ${error.message}`);
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

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    try {
      const product = await this.productRepository.findOne({
        where: { id },
        relations: ['categories'],
      });
      if (!product) {
        throw new NotFoundException('Product not found');
      }

      if (updateProductDto.categories) {
        const categoryEntities = await this.categoryRepository.find({
          where: { id: In(updateProductDto.categories) },
        });
        if (
          !categoryEntities ||
          categoryEntities.length !== updateProductDto.categories.length
        ) {
          throw new BadRequestException('One or more categories are invalid');
        }
        product.categories = categoryEntities;
      }
      Object.assign(product, updateProductDto);

      return this.productRepository.save(product);
    } catch (error) {
      throw new BadRequestException('Update unsuccessful', error.message);
    }
  }

  async delete(id: string): Promise<string> {
    try {
      const product = await this.productRepository.findOne({ where: { id } });
      if (!product) {
        throw new NotFoundException('Product not found');
      }

      await this.productRepository.remove(product);
      return 'Product deleted successfully';
    } catch (error) {
      throw new BadRequestException('Delete unsuccessful', error.message);
    }
  }
}
