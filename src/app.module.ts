import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './module/auth/auth.module';
import { CategoriesModule } from './module/categories/categories.module';
import { OrdersModule } from './module/orders/orders.module';
import { ProductsModule } from './module/products/products.module';
import { UserModule } from './module/user/user.module';
import { ProductCategoryModule } from './product_category/product_category.module';
import { ScheduleModule } from '@nestjs/schedule';
import { InvoiceModule } from './invoice/invoice.module';
import { BullModule } from '@nestjs/bull';
import { MailService } from './mail/mail.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost', 
        port: 6379,        
      },
    }),
    BullModule.registerQueue({
      name: 'mailQueue',
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: +configService.get<number>('DATABASE_PORT'), 
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        autoLoadEntities: true, 
      }),
      inject: [ConfigService], 
    }),
    UserModule, ProductsModule, OrdersModule, AuthModule, CategoriesModule, ProductCategoryModule, InvoiceModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {
  constructor(private dataSource: DataSource){}
}
