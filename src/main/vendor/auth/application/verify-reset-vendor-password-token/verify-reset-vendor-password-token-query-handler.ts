import QueryHandler from '@shared/domain/bus/query/query-handler';
import { QueryResponse } from '@shared/domain/bus/query/query-response';
import { inject } from '@shared/domain/decorators';
import service from '@shared/domain/decorators/service';
import VerifyResetVendorPasswordTokenQuery from './verify-reset-vendor-password-token-query';
import VerifyResetVendorPasswordTokenUseCase from './verify-reset-vendor-password-token-use-case';

@service()
export default class VerifyResetVendorPasswordTokenQueryHandler
  implements QueryHandler
{
  constructor(
    @inject('VerifyResetVendorPasswordTokenUseCase')
    private useCase: VerifyResetVendorPasswordTokenUseCase,
  ) {}

  getQueryName(): string {
    return VerifyResetVendorPasswordTokenQuery.name;
  }

  async handle(
    query: VerifyResetVendorPasswordTokenQuery,
  ): Promise<QueryResponse> {
    return this.useCase.execute({ ...query });
  }
}
