import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { LoggerMiddleware } from 'src/middleware/logger.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], 
})
export class UserModule implements NestModule {
  configure(user: MiddlewareConsumer) {
    user
    .apply(LoggerMiddleware)
    .forRoutes('user')
  }
}
