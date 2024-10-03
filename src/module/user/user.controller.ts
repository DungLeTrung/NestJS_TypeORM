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
import { User } from '../../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(201)
  @ResponseMessage('CREATE USER')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  @Put(':id')
  @HttpCode(201)
  @ResponseMessage('UPDATE USER')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.update(id, updateUserDto);
  }

  @Get()
  @HttpCode(201)
  @ResponseMessage('LIST USERS')
  async getAlls(@Query() paginateDto: PaginateDto): Promise<any> {
    return await this.userService.findAll(paginateDto);
  }

  @Get(':id')
  @HttpCode(201)
  @ResponseMessage('GET USER BY ID')
  async getUserById(@Param('id') id: string): Promise<User> {
    return await this.userService.findById(id);
  }

  @Delete(':id')
  @HttpCode(201)
  @ResponseMessage('DELETE USER')
  async delete(@Param('id') id: string): Promise<string> {
    return await this.userService.delete(id);
  }
}
