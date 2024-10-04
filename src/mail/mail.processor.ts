import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { MailService } from './mail.service';

@Processor('mailQueue')
export class MailProcessor {
  constructor(private readonly emailService: MailService) {}

  @Process()
  async handleEmail(job: Job) {
    const { to, subject, text } = job.data;
    await this.emailService.sendEmail(to, subject, text);
  }
}
