import AuthAdminInfrastructureCommandRepository from '@admin/auth/infrastructure/persistance/typeorm/repositories/auth-admin-infrastructure-command-repository';
import { UnauthorizedException } from '@nestjs/common';
import AuthTokenVerificator from '@shared/domain/authentication/auth-token-verificator';
import { inject } from '@shared/domain/decorators';
import { JWTBaseVerificator } from '@shared/infrastructure/authentication/jwt-base-verificator';
import AuthenticatedUser, {
  AuthenticatedUserPrimitiveProps,
} from '../../dto/authenticated-user';
import RestaurantAccountsRepository from '@restaurants/auth/domain/repositories/restaurant-accounts-repository';
import VendorAccountsRepository from '../../../../src/main/vendor/auth/domain/repositories/vendor-accounts-repository';

export default class UserJWTVerificator
  extends JWTBaseVerificator
  implements AuthTokenVerificator<AuthenticatedUser>
{
  constructor(
    @inject('authentication.token.secret')
    jwtSecret: string,
    @inject('restaurant.token.repository')
    public restaurantAccountRepository: RestaurantAccountsRepository,
    @inject('vendor.token.repository')
    public vendorAccountRepository: VendorAccountsRepository,
    @inject('AuthAdminCommandRepository')
    public adminRepository: AuthAdminInfrastructureCommandRepository,
  ) {
    super(jwtSecret);
  }

  public async verify(params: any): Promise<AuthenticatedUser> {
    if (!params.userType) {
      throw new UnauthorizedException('INVALID_TOKEN');
    }

    const user = await this.searchUser(params);

    if (!user) {
      throw new UnauthorizedException('INVALID_USER');
    }

    return AuthenticatedUser.fromPrimitives(user);
  }

  private async searchUser(
    params: any,
  ): Promise<AuthenticatedUserPrimitiveProps> {
    switch (params.userType) {
      case 'RESTAURANT':
        const user = await this.restaurantAccountRepository.find(params.id);

        return user
          ? {
              id: user.id,
              email: user.email,
              metadata: {
                restaurantId: user.restaurantId,
                type: user.type,
              },
            }
          : null;
      case 'VENDOR':
        const vendor = await this.vendorAccountRepository.find(params.id);

        return vendor
          ? {
              id: vendor.id,
              email: vendor.email,
              metadata: {
                vendorId: vendor.vendorId,
                type: vendor.type,
              },
            }
          : null;

      case 'ADMIN':
        const admin = await this.adminRepository.get(params.id);

        return admin
          ? {
              id: admin.id,
              email: admin.email,
              profilePictureUrl: undefined,
            }
          : null;
      default:
        return null;
    }
  }
}
