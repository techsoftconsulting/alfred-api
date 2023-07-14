import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import CommandHandler from '@shared/domain/bus/command/command-handler';
import EventSubscriber from '@shared/domain/bus/event/event-subscriber';
import QueryHandler from '@shared/domain/bus/query/query-handler';
import NodejsCommandBus from '@shared/infrastructure/bus/command/nodejs-command-bus';
import NodejsEventBus from '@shared/infrastructure/bus/event/nodejs-event-bus';
import NodejsQueryBus from '@shared/infrastructure/bus/query/nodejs-query-bus';
import EJSEmailContentParser from '@shared/infrastructure/email/ejs-email-content-parser';
import NodemailerEmailSender from '@shared/infrastructure/email/nodemailer-email-sender';
import MulterMultipartHandler from '@shared/infrastructure/storage/file-upload.service';
import SimpleCodeGenerator from '@shared/infrastructure/utils/simple-code-generator';
import { FirebaseAdminModule } from '@tfarras/nestjs-firebase-admin';
import * as admin from 'firebase-admin';
import FirebaseUploader from '@shared/infrastructure/storage/firebase-uploader';

const walkSync = require('walk-sync');
const path = require('path');
const multer = require('fastify-multer');

const commandHandlers = discoverCommandHandlers();
const queryHandlers = discoverQueryHandlers();
const eventSubscribers = discoverEventSubscribers();
const useCases = discoverUseCases();
const repositories = discoverRepositories();

const uploadDiskDest = path.join(
  __dirname,
  '../../../../../../../public/uploads',
);
const emailPath = path.resolve(__dirname, '../../../../../../../public/emails');

const multerOptions: any = {
  storage: multer.diskStorage({
    destination: path.join(__dirname, '../../../../../../.uploads'),
    // Use the original file name as is
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
  limits: { fieldSize: 25 * 1024 * 1024 },
};

const CQRSProviders = [
  {
    provide: 'command.bus.handlers',
    useFactory: (...handlers) => {
      return handlers || [];
    },
    inject: [...commandHandlers],
  },
  {
    provide: 'query.bus.handlers',
    useFactory: (...handlers) => {
      return handlers || [];
    },
    inject: [...queryHandlers],
  },
  {
    provide: 'event.bus.subscribers',
    useFactory: (...subscribers) => {
      return subscribers || [];
    },
    inject: [...eventSubscribers],
  },
  {
    provide: 'command.bus',
    useClass: NodejsCommandBus,
  },
  {
    provide: 'query.bus',
    useClass: NodejsQueryBus,
  },
  {
    provide: 'event.bus',
    useClass: NodejsEventBus,
  },
];

const customProviders = [
  {
    provide: 'multipart.handler',
    useClass: MulterMultipartHandler,
  },
  {
    provide: 'file.uploader',
    useClass: FirebaseUploader,
  },
  {
    provide: 'multer.options',
    useValue: multerOptions,
  },
  {
    provide: 'storage.upload.path',
    useValue: uploadDiskDest,
  },
  {
    provide: 'simple.code.generator',
    useClass: SimpleCodeGenerator,
  },
  {
    provide: 'services.email',
    useClass: NodemailerEmailSender,
  },
  {
    provide: 'email.content.parser',
    useClass: EJSEmailContentParser,
  },
  {
    provide: 'emails.root.folder',
    useValue: emailPath,
  },
];

const providers = [
  ...useCases,
  ...repositories,
  ...customProviders,
  ...commandHandlers,
  ...queryHandlers,
  ...eventSubscribers,
  ...CQRSProviders,
];

@Global()
@Module({
  imports: [
    FirebaseAdminModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          apiKey: configService.get<string>('FB_API_KEY'),
          authDomain: configService.get<string>('FB_AUTH_DOMAIN'),
          databaseURL: configService.get<string>('FB_DB_URL'),
          projectId: configService.get<string>('FB_PROJECT_ID'),
          storageBucket: configService.get<string>('FB_STORAGE_BUCKET'),
          messagingSenderId: configService.get<string>(
            'FB_MESSAGING_SENDER_ID',
          ),
          appId: configService.get<string>('FB_APP_ID'),
          measurementId: configService.get<string>('FB_MEASUREMENT_ID'),
          credential: admin.credential.applicationDefault(),
        };
      },
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
  ],
  providers: providers,
  exports: providers,
})
export class CQRSModule {
  constructor() {}
}

export function discoverCommandHandlers(): Array<Constructor<CommandHandler>> {
  return walkSync('src/main', {
    globs: ['**/*-command-handler.ts', '**/command-handlers/**/*.ts'],
    includeBasePath: false,
  }).map((p: string) => {
    const filePath = '../../../../../main/' + p.slice(0, p.lastIndexOf('.'));
    const classConstructor = require(filePath);
    const instance: CommandHandler = classConstructor.default;
    return instance;
  });
}

export function discoverQueryHandlers(): Array<Constructor<QueryHandler>> {
  return walkSync('src/main', {
    globs: ['**/*-query-handler.ts', '**/query-handlers/**/*.ts'],
  }).map((p: string) => {
    const filePath = '../../../../../main/' + p.slice(0, p.lastIndexOf('.'));
    const classConstructor = require(filePath);
    const instance: QueryHandler = classConstructor.default;
    return instance;
  });
}

export function discoverEventSubscribers(): Array<
  Constructor<EventSubscriber>
> {
  return walkSync('src/main', {
    globs: ['**/*-event-subscriber.ts'],
  }).map((p: string) => {
    const filePath = '../../../../../main/' + p.slice(0, p.lastIndexOf('.'));

    const classConstructor = require(filePath);
    const instance: EventSubscriber = classConstructor.default;
    return instance;
  });
}

export function discoverUseCases(): Array<Constructor<CommandHandler>> {
  return walkSync('src/main', {
    globs: ['**/*-use-case.ts', '**/use-cases/**/*.ts'],
  }).map((p: string) => {
    const filePath = '../../../../../main/' + p.slice(0, p.lastIndexOf('.'));
    const classConstructor = require(filePath);
    const instance: CommandHandler = classConstructor.default;

    return {
      provide: `${classConstructor.default.name}`,
      useClass: instance,
    };
  });
}

export function discoverRepositories(): Array<Constructor<CommandHandler>> {
  return walkSync('src/main', {
    globs: ['**/*-infrastructure-*-repository.ts'],
  })
    .map((p: string) => {
      const filePath = '../../../../../main/' + p.slice(0, p.lastIndexOf('.'));
      const classConstructor = require(filePath);
      const instance: CommandHandler = classConstructor.default;
      return instance;
    })
    .filter((r) => {
      const log = true;
      if (!r?.bindingKey && log) {
        console.log(`${r.name} does not have static bindingKey`);
      }

      if (!r) {
        return false;
      }

      return true;
    })
    .map((r) => {
      return {
        provide: `${r.bindingKey}`,
        useClass: r,
      };
    });
}

type Constructor<T> = any;
