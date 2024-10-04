import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice, User } from 'src/entities';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { BullModule } from '@nestjs/bull';
import { MailService } from 'src/mail/mail.service';
import { UserModule } from 'src/module/user/user.module';
import { MailProcessor } from 'src/mail/mail.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice, User]),
    BullModule.registerQueue({
      name: 'mailQueue', 
    }),
    UserModule
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService, MailService, MailProcessor],
  exports: [InvoiceService, TypeOrmModule],
})
export class InvoiceModule {}
