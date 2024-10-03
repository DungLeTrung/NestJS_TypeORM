import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginateDto } from 'src/common/paginate.dto';
import { Category } from 'src/entities';
import { ProductCategory } from 'src/entities/product_category.entity';
import { In, Like, Repository } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(ProductCategory)
    private productCategoryRepository: Repository<ProductCategory>,
  ) {}

  async create(productData: CreateProductDto): Promise<Product> {
    try {
      const { productCategories, ...rest } = productData;

      if (!productCategories || productCategories.length === 0) {
        throw new BadRequestException('At least one category is required');
      }

      const categoryEntities = await this.categoryRepository.find({
        where: { id: In(productCategories) },
      });

      if (categoryEntities.length !== productCategories.length) {
        throw new BadRequestException('One or more categories are invalid');
      }

      const existingProduct = await this.productRepository.findOne({
        where: { name: rest.name },
      });

      if (existingProduct) {
        throw new BadRequestException('Product with this name already exists');
      }

      const product = this.productRepository.create(rest);
      const savedProduct = await this.productRepository.save(product);

      for (const category of categoryEntities) {
        const productCategory = this.productCategoryRepository.create({
          product: savedProduct,
          category,
        });
        await this.productCategoryRepository.save(productCategory);
      }

      return savedProduct;
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

      const filterConditions = {
      };

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
        relations: ['productCategories'],
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
      const product = await this.productRepository.findOne({
        where: { id },
      });
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
        relations: ['productCategories', 'productCategories.category'],
      });
  
      if (!product) {
        throw new NotFoundException('Product not found');
      }
  
      if (updateProductDto.productCategories) {
        const newCategories = await this.categoryRepository.find({
          where: { id: In(updateProductDto.productCategories) },
        });
  
        if (newCategories.length !== updateProductDto.productCategories.length) {
          throw new BadRequestException('One or more categories are invalid');
        }
    
        const newProductCategories = newCategories.map(category => 
          this.productCategoryRepository.create({ 
            product: product,
            category 
          })
        );
        
        await this.productCategoryRepository.save(newProductCategories);
      }
  
      Object.assign(product, updateProductDto);

      product.updatedAt = new Date();

      return await this.productRepository.save(product);
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

      await this.productRepository.softDelete(product.id);
      return 'Product deleted successfully';
    } catch (error) {
      throw new BadRequestException('Delete unsuccessful', error.message);
    }
  }
}
