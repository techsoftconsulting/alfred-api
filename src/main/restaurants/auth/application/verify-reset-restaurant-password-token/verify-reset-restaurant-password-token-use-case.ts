import { QueryResponse } from '@shared/domain/bus/query/query-response';
import { inject } from '@shared/domain/decorators';
import service from '@shared/domain/decorators/service';
import RestaurantAccountsRepository from '@restaurants/auth/domain/repositories/restaurant-accounts-repository';

@service()
export default class VerifyResetRestaurantPasswordTokenUseCase {
  constructor(
    @inject('RestaurantAccountsRepository')
    private repository: RestaurantAccountsRepository,
  ) {}

  async execute(params: {
    token: string;
    email: string;
  }): Promise<QueryResponse> {
    const user = await this.repository.findByResetPasswordToken(params.token);

    if (!user) {
      throw new Error('invalid_reset_token');
    }

    if (user.email !== params.email) {
      throw new Error('invalid_reset_token');
    }

    const res = user.passwordResetToken === params.token;

    if (!res) {
      throw new Error('invalid_reset_token');
    }

    return {
      ok: true,
      result: res,
    };
  }
}
