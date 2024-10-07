import {
  BadRequestException,
  Body,
  Controller,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import * as JSON5 from 'json5';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { extractNameFromContent } from 'src/config/const';
import { SampleDto } from './dto/sample.dto';
import { JwtAuthGuard } from 'src/module/auth/jwt-auth.guard';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Controller('upload')
export class UploadController {
  constructor(@InjectQueue('fileQueue') private fileQueue: Queue) {}

  @Post('file')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    try {
      const fileContent = file?.buffer.toString('utf-8');
      const name = extractNameFromContent(fileContent);

      if (!name) {
        throw new BadRequestException('Name not found in the file');
      }

      if (file.size > 10000000) { 
        await this.fileQueue.add('fileQueue', {
          file: fileContent,
          name,
        });

        return { message: 'File is being processed in the background', name };
      }

      return {
        message: 'File uploaded successfully',
        name,
        file: fileContent,
      };
    } catch (error) {
      throw new BadRequestException('Failed to upload file', error.message);
    }
  }

  @Post('file/pass-validation')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileAndPassValidation(
    @Body() body: SampleDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'json',
        })
        .build({
          fileIsRequired: true,
        }),
    )
    file?: Express.Multer.File,
  ) {
    try {
      if (file) {
        const fileContent = file.buffer.toString();

        const parsedData = JSON5.parse(fileContent);

        if (!parsedData.name || typeof parsedData.name !== 'string') {
          throw new BadRequestException(
            'Name is required and must be a string',
          );
        }

        body.name = parsedData.name;
      }

      return {
        body,
        file: file?.buffer.toString(),
      };
    } catch (error) {
      console.error('Error:', error);
      throw new BadRequestException('Failed to upload file or process body');
    }
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('file/fail-validation')
  uploadFileAndFailValidation(
    @Body() body: SampleDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpg',
        })
        .build(),
    )
    file: Express.Multer.File,
  ) {
    return {
      body,
      file: file.buffer.toString(),
    };
  }

  @Post('multiple')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extension = extname(file.originalname);
          callback(null, file.fieldname + '-' + uniqueSuffix + extension);
        },
      }),
    }),
  )
  async uploadMultipleFiles(
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /^(application\/json|text\/plain|image\/jpeg|image\/png)$/,
        })
        .build({
          fileIsRequired: true,
        }),
    )
    files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded.');
    }

    const uploadedFileNames = files.map((file) => file.filename);

    return {
      message: 'Files uploaded successfully!',
      files: uploadedFileNames,
    };
  }
}
