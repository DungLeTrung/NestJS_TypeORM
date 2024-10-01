import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { ResponseMessage } from 'src/decorator/customize';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginateDto } from 'src/common/paginate.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ResponseMessage('CREATE USER')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  @Put(':id')
  @ResponseMessage('UPDATE USER')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return await this.userService.update(id, updateUserDto);
  }

  @Get()
  @ResponseMessage('LIST USERS')
  async getAlls(@Query() paginateDto: PaginateDto): Promise<any> {
    return await this.userService.findAll(paginateDto);
  }

  @Get(':id')
  @ResponseMessage('GET USER BY ID')
  async getUserById(@Param('id') id: string): Promise<User> {
    return await this.userService.findById(id); 
  }

  @Delete(':id')
  @ResponseMessage('DELETE USER')
  async delete(
    @Param('id') id: string
  ) : Promise<string> {
    return await this.userService.delete(id);
  }
}
