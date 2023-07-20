import TypeOrmRepository from '@shared/infrastructure/persistence/typeorm/typeorm-repository';
import Criteria from '@shared/domain/criteria/criteria';
import NestjsCriteriaConverter from '@shared/infrastructure/nestjs/criteria/nestjs-criteria-converter';
import CustomerAccountsRepository from '../../../../domain/repositories/customer-accounts-repository';
import { CustomerAccountEntity } from '../entities/customer-account-entity';

export default class CustomerAccountsInfrastructureCommandRepository
  extends TypeOrmRepository<CustomerAccountEntity>
  implements CustomerAccountsRepository
{
  static readonly bindingKey = 'CustomerAccountsRepository';

  getEntityClass() {
    return CustomerAccountEntity;
  }

  async saveAccount(user: any): Promise<void> {
    const repository = this.repository();
    const createdAccount = await repository.save(user);
    return createdAccount;
  }

  async delete(id: string): Promise<void> {
    const repository = this.repository();
    const entity = await repository.findOne({
      where: {
        id: id,
      },
    });
    if (entity) {
      await repository.save({
        ...entity,
        status: 'DELETED',
      });
    }
  }

  async find(id: string): Promise<any | null> {
    const entity = await this.repository().findOne({
      where: {
        id: id,
        status: 'ACTIVE',
      },
    });
    return entity || null;
  }

  async findByEmail(email: string): Promise<any | null> {
    const entity = await this.repository().findOne({
      where: {
        email: email,
      },
    });
    return entity || null;
  }

  async findAll(criteria: Criteria): Promise<any[]> {
    const final = NestjsCriteriaConverter.convert(criteria);
    return this.repository().find(final);
  }
}
