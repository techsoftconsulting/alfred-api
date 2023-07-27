import Query from '@shared/domain/bus/query/query';

export default class VerifyResetRestaurantPasswordTokenQuery extends Query {
  constructor(public readonly email: string, public readonly token: string) {
    super();
  }

  name(): string {
    return VerifyResetRestaurantPasswordTokenQuery.name;
  }
}
