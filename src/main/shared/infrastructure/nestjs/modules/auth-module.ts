import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

const providers = [
  {
    provide: 'authentication.token.secret',
    useValue: 'alfred@t0k3n-2021-l0gin-s3cr3t',
  },
  {
    provide: 'authentication.token.expiresIn',
    useValue: '365d',
  },
];
@Module({
  imports: [PassportModule],
  providers: providers,
  exports: providers,
})
export class AuthModule {
  constructor() {}
}
