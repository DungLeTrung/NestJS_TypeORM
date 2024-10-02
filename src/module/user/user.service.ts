import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { PaginateDto } from 'src/common/paginate.dto';
import { Role } from 'src/config/const';
import { FindOneOptions, Like, Not, Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { classToPlain } from 'class-transformer';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(options: FindOneOptions<User>): Promise<User> {
    return await this.userRepository.findOne(options);
  }

  async findById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return classToPlain(user) as User
    } catch (error) {
      throw new BadRequestException('Can not find user', error.message);
    }
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
      throw new BadRequestException('Update unsuccessful', error.message);
    }
  }

  async delete(id: string): Promise<string> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.role === Role.ADMIN) {
        throw new BadRequestException('Can not delete admin account');
      }

      await this.userRepository.remove(user);

      return 'Delete successfully';
    } catch (error) {
      throw new BadRequestException('Delete unsuccessful', error.message);
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
  
      const filterConditions: any = {
        role: Not(Role.ADMIN),
      };
  
      if (filters && typeof filters === 'object') {
        for (const [key, value] of Object.entries(filters)) {
          if (key === 'role' || key === 'isActive') {
            filterConditions[key] = value; 
          } else if (typeof value === 'string') {
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
  
      const totalItems = await this.userRepository.count({
        where: filterConditions,
      });
      const totalPages = Math.ceil(totalItems / limit);
  
      const result = await this.userRepository.find({
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          isActive: true,
        },
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
  
}
