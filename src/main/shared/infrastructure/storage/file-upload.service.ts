// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-file-transfer
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { inject } from '@shared/domain/decorators';
import service from '@shared/domain/decorators/service';
import MultipartHandler from '@shared/domain/storage/multipart-handler';
import { Request, Response } from 'express';

const multer = require('fastify-multer');

const fs = require('fs');

/**
 * A provider to return an `Express` request handler from `multer` middleware
 */
@service()
export default class MulterMultipartHandler
  implements MultipartHandler<Request, Response>
{
  private multer: any;
  constructor(@inject('multer.options') private options: any = {}) {
    if (!this.options.storage) {
      // Default to in-memory storage
      this.options.storage = multer.memoryStorage();
    }

    this.multer = multer(this.options).any();
  }

  public getFilesAndFields<F>(
    request: Request,
    response: Response,
  ): Promise<{ files: any; fields: F }> {
    return new Promise((resolve, reject) => {
      const handle = async (err: unknown) => {
        if (err) reject(err);
        else {
          const { files, body: fields } = request;

          const multerFiles = files as Express.Multer.File[];

          const cleanFilesPromises = multerFiles.map((file) => {
            return new Promise((resolve) => {
              const readFile = fs.readFileSync(file.path);
              resolve(readFile);
            });
          });

          const cleanFiles = await Promise.all(cleanFilesPromises);
          const bufferFiles = cleanFiles.map((file: any) => {
            const encoded = file.toString('base64');

            return Buffer.from(encoded, 'base64');
          });

          const indexedFiles: any = {};

          multerFiles.forEach((file, index) => {
            indexedFiles[file.fieldname] = bufferFiles[index];
          });

          resolve({ files: indexedFiles, fields });
        }
      };

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      this.multer(request, response, handle);
    });
  }
}
