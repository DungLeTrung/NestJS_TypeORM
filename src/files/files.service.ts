import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { Stream } from 'stream';
import * as fs from 'fs';

@Injectable()
export class FilesService {
  private readonly fileDirectory = path.join(__dirname, '../../uploads');

  streamFile(fileName: string): Stream {
    const filePath = path.join(this.fileDirectory, fileName);

    if (fs.existsSync(filePath)) {
      return fs.createReadStream(filePath); 
    } else {
      return null;
    }
  }
}
