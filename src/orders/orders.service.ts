import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { User } from 'src/user/entities/user.entity';
import { EntityManager, In, Like, Repository } from 'typeorm';
import { Status } from 'src/config/const';
import { PaginateDto } from 'src/common/paginate.dto';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(userId: string, orderData: CreateOrderDto): Promise<Order> {
    try {
      const { products } = orderData;
  
      const productIds = products.map(product => product.id);
      const productEntities = await this.productRepository.find({
        where: { id: In(productIds) },
      });
  
      if (productEntities.length !== productIds.length) {
        throw new BadRequestException('One or more products are invalid');
      }
  
      const totalPrice = products.reduce((total, orderProduct) => {
        const product = productEntities.find(prod => prod.id === orderProduct.id);
        if (product) {
          return total + product.price * orderProduct.quantity; 
        }
        return total;
      }, 0);
  
      const order = this.orderRepository.create({
        user: { id: userId }, 
        products: productEntities,
        totalPrice, 
      });
  
      return await this.orderRepository.save(order);
    } catch (error) {
      throw new BadRequestException('Could not create order', error.message);
    }
  }

  async findAll(paginateDto: PaginateDto) {
    try {
      const {
        currentPage,
        limit,
        sortBy = 'id',
        sortOrder = 'ASC',
        filters,
      } = paginateDto;

      const filterConditions = {};

      for (const [key, value] of Object.entries(filters)) {
        if (typeof value === 'string') {
          filterConditions[key] = Like(`%${value}%`);
        } else {
          filterConditions[key] = value;
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

      const totalItems = await this.orderRepository.count({
        where: filterConditions,
      });
      const totalPages = Math.ceil(totalItems / limit);

      const result = await this.orderRepository.find({
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

  async findById(id: string): Promise<Order> {
    try {
      const order = await this.orderRepository.findOne({ where: { id } });
      if (!order) {
        throw new NotFoundException('Order not found');
      }
      return order;
    } catch (error) {
      throw new BadRequestException('Can not find order', error.message);
    }
  }

  async updateOrder(orderId: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    try {
      const order = await this.orderRepository.findOne({ where: { id: orderId } });
      if (!order) {
        throw new NotFoundException('Order not found');
      }

      Object.assign(order, updateOrderDto); 

      return await this.orderRepository.save(order);
    } catch (error) {
      throw new BadRequestException('Update unsuccessful', error.message);
    }
  }

  async delete(id: string): Promise<string> {
    try {
      const order = await this.orderRepository.findOne({ where: { id } });
      if (!order) {
        throw new NotFoundException('Order not found');
      }

      await this.orderRepository.remove(order);

      return 'Delete successfully';
    } catch (error) {
      throw new BadRequestException('Delete unsuccessful', error.message);
    }
  }
}
