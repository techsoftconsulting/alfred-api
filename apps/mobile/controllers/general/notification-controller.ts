import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import CommandBus from '@shared/domain/bus/command/command-bus';
import QueryBus from '@shared/domain/bus/query/query-bus';
import { inject } from '@shared/domain/decorators';
import MultipartHandler from '@shared/domain/storage/multipart-handler';
import ApiController from '@shared/infrastructure/controller/api-controller';
import AdminStatsInfrastructureCommandRepository from '@admin/auth/infrastructure/persistance/typeorm/repositories/stats/admin-stats-infrastructure-command-repository';
import EmailSender from '@shared/domain/email/email-sender';
import EmailContentParser from '@shared/domain/email/email-content-parser';
import EmailMessage from '@shared/domain/email/email-message';
import { fetchJson } from '@apps/mobile/utils/fetch/fetch';

class SendEmailDto {
  @ApiProperty({
    type: 'object',
    properties: {
      email: {
        type: 'string',
      },
      name: {
        type: 'string',
      },
    },
  })
  to: {
    email: string;
    name: string;
  };

  @ApiProperty()
  subject: string;

  @ApiProperty()
  content: string;

  @ApiProperty({
    isArray: true,
    required: false,
    items: {
      type: 'object',
      properties: {
        /*   filename: {
                                                                                                                                                                                                                                                                                                                                                                             type: 'string',
                                                                                                                                                                                                                                                                                                                                                                           },*/
        path: {
          type: 'string',
        },
        cid: {
          type: 'string',
        },
      },
    },
  })
  attachments?: string[];
}

class SendWhatsAppDto {
  @ApiProperty({
    type: 'object',
    properties: {
      phone: {
        type: 'string',
      },
    },
  })
  to: {
    phone: string;
  };

  @ApiProperty()
  templateId: string;

  @ApiProperty({
    isArray: true,
    items: {
      type: 'object',
    },
  })
  templateParams: { type: 'text'; [key: string]: any }[];
}

@ApiTags('General')
@Controller({
  path: 'notifications',
})
export class NotificationController extends ApiController {
  constructor(
    @inject('command.bus')
    commandBus: CommandBus,
    @inject('query.bus')
    queryBus: QueryBus,
    @inject('AdminStatsRepository')
    private repo: AdminStatsInfrastructureCommandRepository,
    @inject('multipart.handler')
    multipartHandler: MultipartHandler<Request, Response>,
    @inject('services.email')
    private mailer: EmailSender,
    @inject('email.content.parser')
    private emailContentParser: EmailContentParser,
  ) {
    super(commandBus, queryBus, multipartHandler);
  }

  @Post('/email')
  @ApiResponse({
    status: 200,
    description: '',
  })
  @ApiOperation({
    summary: '',
  })
  async sendEmail(@Body() data: SendEmailDto): Promise<any> {
    try {
      const email = new EmailMessage({
        to: {
          email: data.to.email,
          name: data.to.name,
        },
        subject: data.subject,
        content: await this.emailContentParser.parseFromFile(
          'general/basic-email.ejs',
          {
            content: data.content,
          },
        ),
        attachments: data.attachments,
      });

      const response = await this.mailer.send(email);

      return {
        result: response,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/whatsapp')
  @ApiResponse({
    status: 200,
    description: '',
  })
  @ApiOperation({
    summary: '',
  })
  async sendWhatsapp(@Body() data: SendWhatsAppDto): Promise<any> {
    try {
      const res = await fetchJson(
        `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_ID}/messages`,
        {
          method: 'POST',
          token: process.env.WHATSAPP_KEY,
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: data.to.phone,
            type: 'template',
            template: { name: data.templateId, language: { code: 'es_MX' } },
            components: [
              {
                type: 'body',
                parameters: data.templateParams,
              },
            ],
          }),
        },
      );

      return {
        result: res,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
