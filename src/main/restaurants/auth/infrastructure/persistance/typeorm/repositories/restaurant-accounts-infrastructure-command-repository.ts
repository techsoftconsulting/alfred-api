import TypeOrmRepository from '@shared/infrastructure/persistence/typeorm/typeorm-repository';
import RestaurantAccountsRepository from '@restaurants/auth/domain/repositories/restaurant-accounts-repository';
import { RestaurantAccountEntity } from '@restaurants/auth/infrastructure/persistance/typeorm/entities/restaurant-account-entity';
import Criteria from '@shared/domain/criteria/criteria';
import NestjsCriteriaConverter from '@shared/infrastructure/nestjs/criteria/nestjs-criteria-converter';

export default class RestaurantAccountsInfrastructureCommandRepository
  extends TypeOrmRepository<RestaurantAccountEntity>
  implements RestaurantAccountsRepository
{
  static readonly bindingKey = 'RestaurantAccountsRepository';

  getEntityClass() {
    return RestaurantAccountEntity;
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
