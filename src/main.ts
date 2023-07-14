import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { contentParser } from 'fastify-multer';
import 'module-alias/register';
import { AppModule } from './main/shared/infrastructure/nestjs/modules/app-module';

const fs = require('fs');

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: false,
      bodyLimit: 1000000000,
    }),
    {
      abortOnError: false,
      logger: ['error'],
      cors: true,
    },
  );
  app.register(contentParser);

  const config = new DocumentBuilder()
    .setTitle('Backend API')
    .setDescription('Documentation API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000, '0.0.0.0');

  process.on('uncaughtException', function (err) {
    console.log(err);
  });
}

bootstrap();
