import QueryHandler from '@shared/domain/bus/query/query-handler';
import { QueryResponse } from '@shared/domain/bus/query/query-response';
import { inject } from '@shared/domain/decorators';
import service from '@shared/domain/decorators/service';
import VerifyResetAdminPasswordTokenUseCase from '@admin/auth/application/verify-reset-admin-password-token/verify-reset-admin-password-token-use-case';
import VerifyResetAdminPasswordTokenQuery from '@admin/auth/application/verify-reset-admin-password-token/verify-reset-admin-password-token-query';

@service()
export default class VerifyResetAdminPasswordTokenQueryHandler
  implements QueryHandler
{
  constructor(
    @inject('VerifyResetAdminPasswordTokenUseCase')
    private useCase: VerifyResetAdminPasswordTokenUseCase,
  ) {}

  getQueryName(): string {
    return VerifyResetAdminPasswordTokenQuery.name;
  }

  async handle(
    query: VerifyResetAdminPasswordTokenQuery,
  ): Promise<QueryResponse> {
    return this.useCase.execute({ ...query });
  }
}
