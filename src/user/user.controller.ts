import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
    async getUserById(@Param('id') id: number): Promise<User> {
        return this.userService.findById(id); 
  }

  @Get('username/:username')
    async findByUserName(@Param('username') username: string): Promise<User | null> {
        return this.userService.findByUsername(username);
    }
}
