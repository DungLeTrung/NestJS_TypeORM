import { Controller, Get, NotFoundException, Param, Res, UseGuards } from '@nestjs/common';
import { FilesService } from './files.service';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/module/auth/jwt-auth.guard';


@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get(':fileName')
  @UseGuards(JwtAuthGuard)
  streamFile(@Param('fileName') fileName: string, @Res() res: Response) {
    const fileStream = this.filesService.streamFile(fileName);

    if (!fileStream) {
      throw new NotFoundException('File not found');
    }

    res.set({
      'Content-Type': 'application/octet-stream', 
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });

    fileStream.pipe(res);
  }
}
