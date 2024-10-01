import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ResponseMessage, Roles } from 'src/decorator/customize';
import { PaginateDto } from 'src/common/paginate.dto';
import { Category } from './entities/category.entity';
import { Role } from 'src/config/const';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
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
    @Body() updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    return await this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ResponseMessage('DELETE CATEGORY')
  async delete(
    @Param('id') id: string
  ) : Promise<string> {
    return await this.categoriesService.delete(id);
  }
}
