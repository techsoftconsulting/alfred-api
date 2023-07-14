import TypeOrmRepository from '@shared/infrastructure/persistence/typeorm/typeorm-repository';
import { RestaurantCategoryEntity } from '@restaurants/auth/infrastructure/persistance/typeorm/entities/restaurant-category-entity';
import ScreensRestaurantCategoryRepository from '@screens/auth/domain/repositories/screens-restaurant-category-repository';
import NestjsCriteriaConverter from '@shared/infrastructure/nestjs/criteria/nestjs-criteria-converter';

export default class ScreensRestaurantCategoryInfrastructureCommandRepository
  extends TypeOrmRepository<RestaurantCategoryEntity>
  implements ScreensRestaurantCategoryRepository
{
  static readonly bindingKey = 'ScreensRestaurantCategoryRepository';

  getEntityClass(): any {
    return RestaurantCategoryEntity;
  }

  async find(id: string): Promise<any | null> {
    const repository = this.repository();
    const category = await repository.findOne({
      where: {
        id: id,
        status: 'ACTIVE',
      },
    });
    return category || null;
  }

  async findAll(criteria?: any): Promise<any[]> {
    const final = NestjsCriteriaConverter.convert(criteria);
    const repository = this.repository();
    const categories = await repository.find(final);
    return categories;
  }
}
