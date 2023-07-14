import { ConfigService } from '@nestjs/config';
import { inject } from '@shared/domain/decorators';
import service from '@shared/domain/decorators/service';
import { FileUploadResponse } from '@shared/domain/storage/file-upload-response';
import { UploadFile } from '@shared/domain/storage/storage-types';
import FileUploader from '@shared/domain/storage/storage-uploader';
import Collection from '@shared/domain/value-object/collection';
import { v4 as uuidv4 } from 'uuid';
const fs = require('fs');
const stream = require('stream');

const FileType = require('file-type');
const mkdirp = require('mkdirp');
const { Duplex } = stream;

function bufferToStream(buffer: any) {
  const duplexStream = new Duplex();
  duplexStream.push(buffer);
  duplexStream.push(null);
  return duplexStream;
}

@service()
export default class DiskUploader implements FileUploader {
  constructor(
    @inject('storage.upload.path')
    private storageDirectory: string,
    private configService: ConfigService,
  ) {}

  async uploadFile(
    file: UploadFile,
    name = `${uuidv4()}`,
    path?: string,
  ): Promise<FileUploadResponse> {
    const publicUrl = this.configService.get<string>('PUBLIC_URL');
    const buffer = Buffer.from(file);
    const type = await FileType.fromBuffer(buffer);
    const extension = type.ext;
    const fileName = `${name}.${extension}`;
    const pathRoute = path ? path + '/' : '';

    const uploadDir = this.storageDirectory + '/' + pathRoute;

    const uploadFolder = this.storageDirectory.slice(
      this.storageDirectory.lastIndexOf('/') + 1,
      this.storageDirectory.length,
    );

    const fileUrl = `${publicUrl}/${uploadFolder}/${pathRoute}${fileName}`;

    await mkdirp(uploadDir, '0777');

    try {
      fs.writeFileSync(uploadDir + fileName, file, 'utf8');
    } catch (error) {
      throw new Error(error);
    }

    return {
      url: fileUrl,
      mimeType: extension,
    };
  }

  async uploadFiles(
    files: Collection<{
      file: UploadFile;
      name?: string;
      fileKey?: string;
      filePath?: string;
    }>,
  ): Promise<Collection<FileUploadResponse>> {
    const filesToUpload = files.map(
      (f: {
        file: UploadFile;
        name?: string;
        fileKey?: string;
        filePath?: string;
      }) => {
        return this.uploadFile(f.file, f.name, f.filePath);
      },
    );

    const response = await Promise.all(filesToUpload);

    return new Collection(response);
  }
}
