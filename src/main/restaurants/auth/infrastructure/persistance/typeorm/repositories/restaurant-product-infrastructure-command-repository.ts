import TypeOrmRepository from '@shared/infrastructure/persistence/typeorm/typeorm-repository';
import { EntityTarget } from 'typeorm';
import RestaurantProductRepository from '@restaurants/auth/domain/repositories/restaurant-product-repository';
import { RestaurantProductEntity } from '@restaurants/auth/infrastructure/persistance/typeorm/entities/restaurant-product-entity';
import NestjsCriteriaConverter from '@shared/infrastructure/nestjs/criteria/nestjs-criteria-converter';

export default class RestaurantProductInfrastructureCommandRepository
  extends TypeOrmRepository<RestaurantProductEntity>
  implements RestaurantProductRepository
{
  static readonly bindingKey = 'RestaurantProductRepository';

  getEntityClass(): EntityTarget<RestaurantProductEntity> {
    return RestaurantProductEntity;
  }

  async save(item: any): Promise<void> {
    const repository = this.repository();
    await repository.save(item);
  }

  async delete(id: string): Promise<void> {
    const repository = this.repository();
    const product = await repository.findOne({
      where: {
        id: id,
      },
    });
    if (product) {
      await repository.save({
        ...product,
        status: 'DELETED',
      });
    }
  }

  async find(id: string): Promise<any | null> {
    const repository = this.repository();
    const product = await repository.findOne({
      where: {
        id: id,
        status: 'ACTIVE',
      },
    });
    return product || null;
  }

  async findAll(filters: any): Promise<any[]> {
    const final = NestjsCriteriaConverter.convert(filters);
    const repository = this.repository();
    const products = await repository.find(final);
    return products;
  }
}
