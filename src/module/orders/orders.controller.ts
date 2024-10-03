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
  Req,
  UseGuards,
} from '@nestjs/common';
import { CustomRequest } from 'src/common/custom-request.interface';
import { PaginateDto } from 'src/common/paginate.dto';
import { ResponseMessage } from 'src/decorator/customize';
import { Order } from '../../entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('CREATE ORDER')
  async createOrder(
    @Req() request: CustomRequest,
    @Body() orderData: CreateOrderDto,
  ): Promise<Order> {
    const userId = request.user?.id;
    return await this.ordersService.create(userId, orderData);
  }

  @Get()
  @HttpCode(201)
  @ResponseMessage('LIST ORDER')
  async getAlls(@Query() paginateDto: PaginateDto): Promise<any> {
    return await this.ordersService.findAll(paginateDto);
  }

  @Get(':id')
  @HttpCode(201)
  @ResponseMessage('GET ORDER BY ID')
  async findOne(@Param('id') id: string): Promise<Order> {
    return await this.ordersService.findById(id);
  }

  @Put(':id')
  @HttpCode(201)
  @ResponseMessage('UPDATE ORDER')
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return this.ordersService.updateOrder(id, updateOrderDto);
  }

  @Delete(':id')
  @HttpCode(201)
  @ResponseMessage('DELETE ORDER')
  async delete(@Param('id') id: string): Promise<string> {
    return await this.ordersService.delete(id);
  }
}
