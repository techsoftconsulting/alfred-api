import Query from '@shared/domain/bus/query/query';

export default class VerifyResetVendorPasswordTokenQuery extends Query {
  constructor(public readonly email: string, public readonly token: string) {
    super();
  }

  name(): string {
    return VerifyResetVendorPasswordTokenQuery.name;
  }
}
