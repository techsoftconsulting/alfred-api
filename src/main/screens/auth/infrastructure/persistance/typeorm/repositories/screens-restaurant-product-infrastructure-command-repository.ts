import TypeOrmRepository from '@shared/infrastructure/persistence/typeorm/typeorm-repository';
import { RestaurantProductEntity } from '@restaurants/auth/infrastructure/persistance/typeorm/entities/restaurant-product-entity';
import ScreensRestaurantProductRepository from '@screens/auth/domain/repositories/screens-restaurant-product-repository';
import NestjsCriteriaConverter from '@shared/infrastructure/nestjs/criteria/nestjs-criteria-converter';

export default class ScreensRestaurantProductInfrastructureCommandRepository
  extends TypeOrmRepository<RestaurantProductEntity>
  implements ScreensRestaurantProductRepository
{
  static readonly bindingKey = 'ScreensRestaurantProductRepository';

  getEntityClass(): any {
    return RestaurantProductEntity;
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
