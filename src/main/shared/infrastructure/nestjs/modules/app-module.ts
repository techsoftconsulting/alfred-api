import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AdminModule } from './admin-module';
import { AppAuthModule } from './app-auth-module';
import { CQRSModule } from './cqrs-module';
import { MobileModule } from './mobile-module';
import { TokenModule } from './token-module';
import { TypeOrmModule } from '@nestjs/typeorm';

const path = require('path');

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '../../../../../../../public'),
    }),
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV
        ? `.env.${process.env.NODE_ENV}`
        : '.env.development',
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          entities: [__dirname + '/../../../../../main/**/*-entity{.ts,.js}'],
          autoLoadEntities: true,
          host: config.get<string>('DATABASE_HOST'),
          port: config.get<number>('DATABASE_PORT'),
          database: config.get<string>('DATABASE_NAME'),
          username: config.get<string>('DATABASE_USER'),
          password: config.get<string>('DATABASE_PASSWORD'),
          migrations: ['dist/migrations/!*.{ts,js}'],
          migrationsTableName: 'typeorm_migrations',
          logger: 'file',
          synchronize: false, // process.env.NODE_ENV === 'development',
          /*  extra: {
                                                      ssl: {
                                                        rejectUnauthorized: false,
                                                      },
                                                    },*/
        };
      },
      inject: [ConfigService],
      imports: [ConfigService],
    }),
    TokenModule,
    AppAuthModule,
    MobileModule,
    AdminModule,
    CQRSModule,
  ],
  controllers: [],
  exports: [],
  providers: [],
})
export class AppModule {
  constructor() {}
}
