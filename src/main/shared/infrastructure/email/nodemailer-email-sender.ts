import { ConfigService } from '@nestjs/config';
import service from '@shared/domain/decorators/service';
import { ObjectUtils } from '@shared/domain/utils';
import { SentMessageInfo } from 'nodemailer';
import EmailMessage from '../../domain/email/email-message';
import EmailSender from '../../domain/email/email-sender';
import Mail = require('nodemailer/lib/mailer');
const nodemailer = require('nodemailer');

@service()
export default class NodemailerEmailSender implements EmailSender {
  private sender: any;

  constructor(private configService: ConfigService) {
    const config = {
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get('MAIL_PORT'),
      auth: {
        user: this.configService.get('MAIL_USERNAME'),
        pass: this.configService.get('MAIL_PASSWORD'),
      },
      ...(process.env.MAIL_HOST &&
        process.env.MAIL_HOST?.indexOf('mail.antagonist.nl') > -1 && {
          secure: false,
          tls: {
            rejectUnauthorized: false,
          },
        }),

      secure: true,
      tls: {
        rejectUnauthorized: false,
      },
      /*
            secure: false,
               tls: {
                rejectUnauthorized: false,
            }, 
            */
      /*   ...(!process.env.MAIL_SERVICE && {
                host: process.env.MAIL_HOST,
                port: process.env.MAIL_PORT,
                secure: false,
            }),
            ...(process.env.MAIL_SERVICE && {
                service: process.env.MAIL_SERVICE,
            }),
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false,
            }, */
    };

    this.sender = nodemailer.createTransport(config);
  }

  async send(email: EmailMessage): Promise<SentMessageInfo> {
    const content = email.toPrimitives();
    const defaultFromRecipient = {
      email: this.configService.get('MAIL_USERNAME') ?? '',
      name: this.configService.get('MAIL_FROM_NAME'),
    };

    /*  if (process.env.NODE_ENV === 'development') {
      console.log('EMAILS ARE DISABLED IN NODEMAILER WHEN DEVELOPMENT');
      return;
    }
 */
    const emailData = {
      ...ObjectUtils.omit(content, [
        'toName',
        'toEmail',
        'fromName',
        'fromEmail',
      ]),
      to: this.formatRecipient({
        email: content.toEmail,
        name: content.toName,
      }),
      from: this.formatRecipient(
        content.fromEmail
          ? {
              email: content.fromEmail,
              name: content.fromName,
            }
          : defaultFromRecipient,
      ),
      text: content.content,
      html: content.content,
    };

    return this.sender.sendMail(emailData);
  }

  formatRecipient(recipient: { email: string; name?: string }): string {
    return `${recipient?.name && `"${recipient?.name}" `}${recipient.email}`;
  }

  verify(): void {
    this.sender.verify(function (error: any, success: boolean) {
      if (error) {
        console.log(error);
      } else {
        console.log('Server is ready to take our messages');
      }
    });
  }
}
