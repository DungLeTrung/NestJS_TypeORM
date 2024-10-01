import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PaginateDto } from 'src/common/paginate.dto';
import { ResponseMessage } from 'src/decorator/customize';
import { Category } from '../../entities/category.entity';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ResponseMessage('CREATE CATEGORY')
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ResponseMessage('LIST CATEGORIES')
  async getAlls(@Query() paginateDto: PaginateDto): Promise<any> {
    return await this.categoriesService.findAll(paginateDto);
  }

  @Get(':id')
  @ResponseMessage('GET CATEGORY BY ID')
  async findOne(@Param('id') id: string): Promise<Category> {
    return await this.categoriesService.findById(id);
  }

  @Put(':id')
  @ResponseMessage('UPDATE CATEGORY')
  async updateUser(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return await this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ResponseMessage('DELETE CATEGORY')
  async delete(@Param('id') id: string): Promise<string> {
    return await this.categoriesService.delete(id);
  }
}
