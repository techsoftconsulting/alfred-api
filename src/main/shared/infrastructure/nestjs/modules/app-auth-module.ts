import UserJWTCreator from '@apps/shared/infrastructure/authentication/user-jwt-token-creator';
import UserJWTVerificator from '@apps/shared/infrastructure/authentication/user-jwt-token-verificator';
import { Global, Module } from '@nestjs/common';
import { AuthModule } from './auth-module';
import RestaurantAccountsInfrastructureCommandRepository from '@restaurants/auth/infrastructure/persistance/typeorm/repositories/restaurant-accounts-infrastructure-command-repository';
import VendorAccountsInfrastructureCommandRepository from '../../../../vendor/auth/infrastructure/persistance/typeorm/repositories/vendor-accounts-infrastructure-command-repository';

export const UserTokenCreator = {
  provide: 'user.authentication.token.creator',
  useClass: UserJWTCreator,
};

export const UserTokenVerificator = {
  provide: 'user.authentication.token.verificator',
  useClass: UserJWTVerificator,
};

const RestaurantTokenRepoProvider = {
  provide: 'restaurant.token.repository',
  useClass: RestaurantAccountsInfrastructureCommandRepository,
};

const VendorTokenRepoProvider = {
  provide: 'vendor.token.repository',
  useClass: VendorAccountsInfrastructureCommandRepository,
};

@Global()
@Module({
  imports: [AuthModule],
  providers: [
    UserTokenCreator,
    RestaurantTokenRepoProvider,
    VendorTokenRepoProvider,
    UserTokenVerificator,
  ],
  exports: [
    UserTokenCreator,
    RestaurantTokenRepoProvider,
    VendorTokenRepoProvider,
    UserTokenVerificator,
  ],
})
export class AppAuthModule {
  constructor() {}
}
