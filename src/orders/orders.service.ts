import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { User } from 'src/user/entities/user.entity';
import { EntityManager } from 'typeorm';
import { Status } from 'src/config/const';

@Injectable()
export class OrdersService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager
  ) {}

  async createOrder(userId: string, orderData: CreateOrderDto): Promise<Order> {
    return await this.entityManager.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { id: userId } });
      if (!user) {
        throw new BadRequestException('User not found!!!')
      }
      const order = new Order();
      order.user = user;
      order.total_price = orderData.total_price;
      if (!(orderData.status in Status)) {
        throw new BadRequestException('Invalid status value!!!')
      }
      order.status = Status[orderData.status as keyof typeof Status];
      return await manager.save(order);
    });
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
