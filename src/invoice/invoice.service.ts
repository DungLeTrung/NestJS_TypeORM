import { InjectQueue } from '@nestjs/bull';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { StatusInvoice } from 'src/config/const';
import { Invoice, User } from 'src/entities';
import { MailService } from 'src/mail/mail.service';
import { In, LessThan, Repository } from 'typeorm';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectQueue('mailQueue')
    private readonly emailQueue: Queue,
    private readonly emailService: MailService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    try {
      const user = await this.userRepository.findOne({where:{id: createInvoiceDto.userId}});
      if (!user) {
        throw new BadRequestException('User not found');
      }

      const invoice = this.invoiceRepository.create({
        dueDate: new Date(createInvoiceDto.dueDate),
        status: StatusInvoice.NEW,
        user, 
      });

      return await this.invoiceRepository.save(invoice);
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
        relations: ['user'],
      });

      console.log(overdueInvoices)

      const ids = [];

      if (overdueInvoices.length > 0) {
        overdueInvoices.forEach((item) => {
          ids.push(item.id);
        });

        await this.invoiceRepository.update(
          { id: In(ids) },
          { status: StatusInvoice.OVERDUE },
        );

        for (const invoice of overdueInvoices) {
          const user = invoice.user;
          console.log(user)
          if (user && user.email) {
            await this.emailQueue.add({
              to: user.email,
              subject: 'Invoice Overdue Notification',
              text: `Your invoice with ID ${invoice.id} is overdue.`,
            });
            console.log(
              `Email task added to queue for ${user.email} for overdue invoice ID ${invoice.id}`,
            );
          }
        }
      }
    } catch (error) {
      throw new BadRequestException(
        'Error updating invoice statuses',
        error.message,
      );
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} invoice`;
  }
}
