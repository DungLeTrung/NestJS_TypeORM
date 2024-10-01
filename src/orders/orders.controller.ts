import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';
import { ResponseMessage } from 'src/decorator/customize';
import { PaginateDto } from 'src/common/paginate.dto';
import { Request } from 'express';
import { CustomRequest } from 'src/common/custom-request.interface';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ResponseMessage("CREATE ORDER")
  async createOrder(
    @Req() request: CustomRequest,
    @Body() orderData: CreateOrderDto
  ): Promise<Order> {
    const userId = request.user.id;
    return await this.ordersService.create(userId, orderData);
  }

  @Get()
  @ResponseMessage('LIST ORDER')
  async getAlls(@Query() paginateDto: PaginateDto): Promise<any> {
    return await this.ordersService.findAll(paginateDto);
  }

  @Get(':id')
  @ResponseMessage('GET ORDER BY ID')
  async findOne(@Param('id') id: string): Promise<Order> {
    return await this.ordersService.findById(id); 
  }

  @Put(':id')
  @ResponseMessage('UPDATE ORDER')
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return this.ordersService.updateOrder(id, updateOrderDto);
  }

  @Delete(':id')
  @ResponseMessage('DELETE ORDER')
  async delete(
    @Param('id') id: string
  ) : Promise<string> {
    return await this.ordersService.delete(id);
  }
}
