import { UserJwtStrategy } from '@apps/shared/infrastructure/authentication/strategies/user-jwt-strategy';
import { Module } from '@nestjs/common';
import { AppAuthModule } from './app-auth-module';
import { AuthModule } from './auth-module';

const walkSync = require('walk-sync');

const controllers = discoverControllers();

@Module({
  imports: [AppAuthModule, AuthModule],
  exports: [UserJwtStrategy],
  providers: [UserJwtStrategy],
  controllers: [...controllers],
})
export class MobileModule {
  constructor() {}
}

type Constructor<T> = any;

export function discoverControllers(): Array<Constructor<any>> {
  return walkSync('apps', {
    globs: ['alfred/**/*.controller.ts', 'alfred/**/*-controller.ts'],
    includeBasePath: false,
  }).map((p: string) => {
    const filePath = '../../../../../../apps/' + p.slice(0, p.lastIndexOf('.'));
    const classConstructor = require(filePath);
    const instance: any = classConstructor;
    return Object.values(instance)[0];
  });
}
