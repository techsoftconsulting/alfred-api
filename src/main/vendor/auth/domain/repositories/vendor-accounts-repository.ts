import Criteria from '@shared/domain/criteria/criteria';

export default interface VendorAccountsRepository {
  saveAccount(user: any): Promise<void>;

  delete(id: string): Promise<void>;

  find(id: string): Promise<any | null>;

  findByEmail(email: string): Promise<any | null>;

  findAll(criteria: Criteria): Promise<any[]>;
}
