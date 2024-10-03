import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from 'src/entities';
import { In, LessThan, Repository } from 'typeorm';
import { StatusInvoice } from 'src/config/const';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    try {
      const invoice = this.invoiceRepository.create({
        dueDate: new Date(createInvoiceDto.dueDate),
        status: StatusInvoice.NEW,
      });
      return this.invoiceRepository.save(invoice);
    } catch (error) {
      throw new BadRequestException('Create Invoice Unsuccessfully', error.message);
    }
  }

  async findAll(): Promise<Invoice[]> {
    return this.invoiceRepository.find();
  }

  @Cron('*/30 * * * * *')
  async handleCron() {
    try {
      const currentDate = new Date();
      const overdueInvoices = await this.invoiceRepository.find({
        where: {
          dueDate: LessThan(currentDate),
          status: StatusInvoice.NEW,
        },
      });

      const ids = []

      if (overdueInvoices.length > 0) {
        overdueInvoices.map((item) => {
          return ids.push(item.id);
        })
        await this.invoiceRepository.update(
          { id:  In(ids)  }, 
          { status: StatusInvoice.OVERDUE } 
      );
        console.log(`Updated ${overdueInvoices.length} invoices to OVERDUE status.`);
      }
    } catch (error) {
      console.error('Error updating invoice statuses', error.stack);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} invoice`;
  }
}
