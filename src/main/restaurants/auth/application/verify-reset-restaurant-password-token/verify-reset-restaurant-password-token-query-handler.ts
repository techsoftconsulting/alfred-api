import QueryHandler from '@shared/domain/bus/query/query-handler';
import { QueryResponse } from '@shared/domain/bus/query/query-response';
import { inject } from '@shared/domain/decorators';
import service from '@shared/domain/decorators/service';
import VerifyResetRestaurantPasswordTokenQuery from '@restaurants/auth/application/verify-reset-restaurant-password-token/verify-reset-restaurant-password-token-query';
import VerifyResetRestaurantPasswordTokenUseCase from '@restaurants/auth/application/verify-reset-restaurant-password-token/verify-reset-restaurant-password-token-use-case';

@service()
export default class VerifyResetRestaurantPasswordTokenQueryHandler
  implements QueryHandler
{
  constructor(
    @inject('VerifyResetRestaurantPasswordTokenUseCase')
    private useCase: VerifyResetRestaurantPasswordTokenUseCase,
  ) {}

  getQueryName(): string {
    return VerifyResetRestaurantPasswordTokenQuery.name;
  }

  async handle(
    query: VerifyResetRestaurantPasswordTokenQuery,
  ): Promise<QueryResponse> {
    return this.useCase.execute({ ...query });
  }
}
