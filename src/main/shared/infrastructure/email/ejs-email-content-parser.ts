// import {emailPath} from '@application';
import { inject } from '@shared/domain/decorators';
import EmailContentParser from '../../domain/email/email-content-parser';
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

export default class EJSEmailContentParser implements EmailContentParser {
  constructor(
    @inject('emails.root.folder')
    private emailsPath: string,
  ) {}

  async parseFromFile(filePath: string, params?: any): Promise<string> {
    const file = this.emailsPath + '/' + filePath;

    return new Promise((resolve, reject) => {
      ejs.renderFile(file, params, {}, function (err: any, str: string) {
        if (err) reject(err);
        resolve(str);
      });
    });
  }
}
