import { AdminAuthCredentialsProps } from '@admin/auth/domain/models/admin-auth-credentials';
import AuthTokenCreator from '@shared/domain/authentication/auth-token-creator';
import { inject } from '@shared/domain/decorators';
import service from '@shared/domain/decorators/service';
import PasswordHasher from '@shared/domain/utils/password-hasher';
import AdminAuthUser from '../../domain/models/admin-auth-user';
import AuthAdminCommandRepository from '@admin/auth/domain/repositories/auth-admin-command-repository';

@service()
export default class AuthenticateAdminUseCase {
  constructor(
    @inject('AuthAdminCommandRepository')
    private userFinder: AuthAdminCommandRepository,
    @inject('user.authentication.token.creator')
    private tokenCreator: AuthTokenCreator<any>,
    @inject('utils.passwordHasher')
    private passwordHasher: PasswordHasher,
  ) {}

  public async execute(
    credentials: AdminAuthCredentialsProps,
  ): Promise<string | null> {
    const authUser: AdminAuthUser = await this.ensureUserExists(
      credentials.email,
    );

    await this.ensureCredentialsAreValid(authUser, credentials);

    const tokenData = {
      email: authUser.email,
      firstName: authUser.firstName,
      lastName: authUser.lastName,
      id: authUser.id.value,
      role: authUser.role,
      userType: 'ADMIN',
    };
    const token = await this.tokenCreator.generate(tokenData);

    return token;
  }

  private async ensureUserExists(email: string): Promise<AdminAuthUser> {
    const user = await this.userFinder.findUser(email);

    if (!user) {
      throw new Error('user_not_found');
    }

    return user;
  }

  private async ensureCredentialsAreValid(
    authUser: AdminAuthUser,
    credentials: AdminAuthCredentialsProps,
  ) {
    const result = await this.passwordHasher.comparePassword(
      credentials.password ?? '',
      authUser.password ?? '',
    );

    if (!result) {
      throw new Error('invalid_credentials');
    }

    return result;
  }
}
