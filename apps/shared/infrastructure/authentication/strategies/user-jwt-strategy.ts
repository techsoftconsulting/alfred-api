import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import AuthTokenVerificator from '@shared/domain/authentication/auth-token-verificator';
import { inject } from '@shared/domain/decorators';
import { ExtractJwt, Strategy } from 'passport-jwt';
import AuthenticatedUser from '../../../dto/authenticated-user';

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @inject('user.authentication.token.verificator')
    public tokenService: AuthTokenVerificator<AuthenticatedUser>,
    @inject('authentication.token.secret')
    jwtSecret: string,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    //const token: string = this.extractCredentials(request);

    const userProfile = await this.tokenService.verify(payload);

    return userProfile;
  }
}
