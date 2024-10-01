import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Like, Repository } from 'typeorm';
import { PaginateDto } from 'src/common/paginate.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(categoryData: Partial<Category>): Promise<Category> {
    try {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name: categoryData.name }, 
      });
  
      if (existingCategory) {
        throw new BadRequestException('Category with this name already exists');
      }
      const category = await this.categoryRepository.create({
        ...categoryData,
      });
  
      return await this.categoryRepository.save(category);
    } catch (error) {
      throw new BadRequestException("Could not create category", error.message);
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

      const totalItems = await this.categoryRepository.count({
        where: filterConditions,
      });
      const totalPages = Math.ceil(totalItems / limit);

      const result = await this.categoryRepository.find({
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

  async findById(id: string): Promise<Category> {
    try {
      const category = await this.categoryRepository.findOne({ where: { id } });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      return category;
    } catch (error) {
      throw new BadRequestException('Can not find category', error.message);
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    try {
      const category = await this.categoryRepository.findOne({ where: { id } });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
  
      Object.assign(category, updateCategoryDto);
      
      return this.categoryRepository.save(category);
    } catch (error) {
      throw new BadRequestException('Update unsuccessful', error.message)
    }
  }

  async delete(id: string): Promise<string> {
    try {
      const category = await this.categoryRepository.findOne({ where: { id } });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
  
      await this.categoryRepository.remove(category);
      return "Category deleted successfully"
    } catch (error) {
      throw new BadRequestException('Delete unsuccessful', error.message)
    }
  }
}
