import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';

@Injectable()
export class AppService {

  // Sử dụng cron để thực hiện một tác vụ mỗi 10 giây
  // @Cron('*/10 * * * * *')
  // handleCron() {
  //   console.log('Task executed every 10 seconds');
  // }

  // Sử dụng các biểu thức cron đã định nghĩa trước trong NestJS (ví dụ: mỗi giờ)
  // @Cron(CronExpression.EVERY_HOUR)
  // handleHourlyCron() {
  //   console.log('Task executed every hour');
  // }

  // Chạy một lần sau một khoảng thời gian nhất định kể từ khi ứng dụng bắt đầu
  // @Timeout(5000)
  // handleTimeout() {
  //   console.log('Task executed once after 5 seconds');
  // }

  // Lặp lại tác vụ sau một khoảng thời gian cụ thể (ví dụ: mỗi 5 giây)
  // @Interval(5000)
  // handleInterval() {
  //   console.log('Task executed every 5 seconds');
  // }
}
