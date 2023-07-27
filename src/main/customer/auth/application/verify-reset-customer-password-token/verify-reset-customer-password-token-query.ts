import Query from '@shared/domain/bus/query/query';

export default class VerifyResetCustomerPasswordTokenQuery extends Query {
  constructor(public readonly email: string, public readonly token: string) {
    super();
  }

  name(): string {
    return VerifyResetCustomerPasswordTokenQuery.name;
  }
}
