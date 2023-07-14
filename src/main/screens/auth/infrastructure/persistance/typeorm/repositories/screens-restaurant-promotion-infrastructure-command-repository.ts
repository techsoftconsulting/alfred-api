import TypeOrmRepository from '@shared/infrastructure/persistence/typeorm/typeorm-repository';
import { RestaurantPromotionEntity } from '@restaurants/auth/infrastructure/persistance/typeorm/entities/restaurant-promotion-entity';
import ScreensRestaurantPromotionRepository from '@screens/auth/domain/repositories/screens-restaurant-promotion-repository';
import NestjsCriteriaConverter from '@shared/infrastructure/nestjs/criteria/nestjs-criteria-converter';

export default class ScreensRestaurantPromotionInfrastructureCommandRepository
  extends TypeOrmRepository<RestaurantPromotionEntity>
  implements ScreensRestaurantPromotionRepository
{
  static readonly bindingKey = 'ScreensRestaurantPromotionRepository';

  getEntityClass(): any {
    return RestaurantPromotionEntity;
  }

  async find(id: string): Promise<any | null> {
    const repository = this.repository();
    const promotion = await repository.findOne({
      where: {
        id: id,
        status: 'ACTIVE',
      },
    });
    return promotion || null;
  }

  async findAll(filters: any): Promise<any[]> {
    const final = NestjsCriteriaConverter.convert(filters);
    const repository = this.repository();
    const promotions = await repository.find(final);
    return promotions;
  }
}
