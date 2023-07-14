import { Global, Module } from '@nestjs/common';
import BcryptHasher from '@shared/infrastructure/utils/bcrypt-password-hasher';

const hashProviders = [
  {
    provide: 'utils.hasher.round',
    useValue: 10,
  },
  {
    provide: 'utils.passwordHasher',
    useClass: BcryptHasher,
  },
];
@Global()
@Module({
  imports: [],
  providers: hashProviders,
  exports: hashProviders,
})
export class TokenModule {
  constructor() {}
}
