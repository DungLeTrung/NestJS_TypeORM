import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from './multer.config';
import { BullModule } from '@nestjs/bull';

@Module({
  controllers: [UploadController],
  providers: [UploadService],
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
    BullModule.registerQueue({
      name: 'fileQueue', 
    }),
  ],
})
export class UploadModule {}
