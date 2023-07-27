import QueryHandler from '@shared/domain/bus/query/query-handler';
import { QueryResponse } from '@shared/domain/bus/query/query-response';
import { inject } from '@shared/domain/decorators';
import service from '@shared/domain/decorators/service';
import VerifyResetCustomerPasswordTokenQuery from './verify-reset-customer-password-token-query';
import VerifyResetCustomerPasswordTokenUseCase from './verify-reset-customer-password-token-use-case';

@service()
export default class VerifyResetCustomerPasswordTokenQueryHandler
  implements QueryHandler
{
  constructor(
    @inject('VerifyResetCustomerPasswordTokenUseCase')
    private useCase: VerifyResetCustomerPasswordTokenUseCase,
  ) {}

  getQueryName(): string {
    return VerifyResetCustomerPasswordTokenQuery.name;
  }

  async handle(
    query: VerifyResetCustomerPasswordTokenQuery,
  ): Promise<QueryResponse> {
    return this.useCase.execute({ ...query });
  }
}
