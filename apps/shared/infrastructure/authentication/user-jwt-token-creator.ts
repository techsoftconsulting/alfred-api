import TokenCreator from '@shared/domain/authentication/auth-token-creator';
import { inject } from '@shared/domain/decorators';
import { JWTBaseCreator } from '@shared/infrastructure/authentication/jwt-base-creator';
import AuthenticatedUser from '../../dto/authenticated-user';

export default class UserJWTCreator
  extends JWTBaseCreator
  implements TokenCreator<AuthenticatedUser>
{
  constructor(
    @inject('authentication.token.secret')
    jwtSecret: string,
    @inject('authentication.token.expiresIn')
    jwtExpiresIn: string,
  ) {
    super(jwtSecret, jwtExpiresIn);
  }

  public async generate(data: any): Promise<string> {
    return this.generateToken(data);
  }
}
