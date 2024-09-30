import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';
import { ResponseMessage } from 'src/decorator/customize';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post(':userId')
  @ResponseMessage("CREATE ORDER")
  async createOrder(
    @Param('userId') userId: string,
    @Body() orderData: CreateOrderDto
  ): Promise<Order> {
    return await this.ordersService.createOrder(userId, orderData)
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
