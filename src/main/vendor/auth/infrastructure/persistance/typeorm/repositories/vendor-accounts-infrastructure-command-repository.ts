import TypeOrmRepository from '@shared/infrastructure/persistence/typeorm/typeorm-repository';
import Criteria from '@shared/domain/criteria/criteria';
import NestjsCriteriaConverter from '@shared/infrastructure/nestjs/criteria/nestjs-criteria-converter';
import VendorAccountsRepository from '../../../../domain/repositories/vendor-accounts-repository';
import { VendorAccountEntity } from '../entities/vendor-account-entity';

export default class VendorAccountsInfrastructureCommandRepository
  extends TypeOrmRepository<VendorAccountEntity>
  implements VendorAccountsRepository
{
  static readonly bindingKey = 'VendorAccountsRepository';

  getEntityClass() {
    return VendorAccountEntity;
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
