import service from '@shared/domain/decorators/service';
import FileUploader from '@shared/domain/storage/storage-uploader';
import { FileUploadResponse } from '@shared/domain/storage/file-upload-response';
import Collection from '@shared/domain/value-object/collection';
import { UploadFile } from '@shared/domain/storage/storage-types';
import firebase from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

const FileType = require('file-type');
const uuid = require('uuid');
import moment = require('moment');

@service()
export default class FirebaseUploader implements FileUploader {
  async uploadFile(
    file: UploadFile,
    name = `${uuidv4()}`,
    path?: string,
    key?: string,
  ): Promise<FileUploadResponse> {
    const buffer = Buffer.from(file);

    const type = await FileType.fromBuffer(buffer);

    const extension: any = type.ext;

    return new Promise(async (resolve, reject) => {
      const envFolder = process.env.NODE_ENV === 'production' ? '' : 'dev/';

      const fileName = `${path ? envFolder + path + '/' : ''}${name}.${
        extension === 'xml' ? 'svg' : extension
      }`;

      const fileRef = firebase.storage().bucket().file(fileName, {});

      await fileRef.save(buffer, {
        public: true,
        metadata: {
          /*  contentType: 'image/png',*/
          metadata: {
            firebaseStorageDownloadTokens: uuid.v4(),
            lastUpdate: moment().format('DD/MM/YYYY HH:mm:ss'),
          },
        },
        resumable: false,
      });

      resolve({
        key: key,
        url: fileRef.publicUrl(),
        mimeType: extension,
      });
    });
  }

  async uploadFiles(
    files: Collection<{
      file: UploadFile;
      name?: string;
      fileKey?: string;
      filePath?: string;
    }>,
  ): Promise<Collection<FileUploadResponse>> {
    const promises = files.map((item) =>
      this.uploadFile(item.file, item.name, item.filePath, item.fileKey),
    );

    const res = await Promise.all(promises);

    return new Collection(res);
  }
}
