import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { ResponseMessage } from 'src/decorator/customize';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ResponseMessage('CREATE USER')
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  @ResponseMessage('UPDATE USER')
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Get()
  @ResponseMessage('LIST USERS')
  findAll(
    @Query('page') currentPage: string,
    @Query('limit') limit: string,
    @Query() qs: string,
  ) {
    return this.userService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('GET USER BY ID')
  getUserById(@Param('id') id: string): Promise<User> {
    return this.userService.findById(id); 
  }

  @Delete(':id')
  @ResponseMessage('DELETE USER')
  delete(
    @Param('id') id: string
  ) : Promise<string> {
    return this.userService.delete(id);
  }
}
