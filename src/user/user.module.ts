import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from 'src/middleware/logger.middleware';
import { User } from 'src/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule], 
})

export class UserModule implements NestModule {
  configure(user: MiddlewareConsumer) {
    user
    .apply(LoggerMiddleware)
    .forRoutes('user')
  }
}
