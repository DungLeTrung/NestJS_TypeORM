import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import aqp from 'api-query-params';
import * as bcrypt from 'bcrypt';
import { Not, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role, transformSort } from 'src/config/const';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new BadRequestException('Can not find user', error.message);
    }
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      Object.assign(user, updateUserDto);
      
      return this.userRepository.save(user);
    } catch (error) {
      throw new BadRequestException('Update unsuccessful', error.message)
    }
  }

  async delete(id: string): Promise<string> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      await this.userRepository.remove(user);
      
      return "Delete successfully";
    } catch (error) {
      throw new BadRequestException('Delete unsuccessful', error.message)
    }
  }

  async findAll(currentPage?: number, limit?: number, qs?: string) {
    try {
      const { filter, sort } = aqp(qs);
      delete filter.page;
      delete filter.size;
      
      filter.role = Not(Role.ADMIN);

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
  
      const totalItems = await this.userRepository.count({ where: filter });
      const totalPages = isPaginationEnabled ? Math.ceil(totalItems / limit) : 1;
  
      const result = await this.userRepository.find({
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

}
