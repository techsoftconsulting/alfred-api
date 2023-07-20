import Criteria from '@shared/domain/criteria/criteria';

export default interface CustomerAccountsRepository {
  saveAccount(user: any): Promise<void>;

  delete(id: string): Promise<void>;

  find(id: string): Promise<any | null>;

  findByEmail(email: string): Promise<any | null>;

  findAll(criteria: Criteria): Promise<any[]>;
}
