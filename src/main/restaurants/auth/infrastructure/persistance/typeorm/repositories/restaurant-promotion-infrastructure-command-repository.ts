import TypeOrmRepository from '@shared/infrastructure/persistence/typeorm/typeorm-repository';
import { EntityTarget } from 'typeorm';
import RestaurantPromotionRepository from '@restaurants/auth/domain/repositories/restaurant-promotion-repository';
import { RestaurantPromotionEntity } from '@restaurants/auth/infrastructure/persistance/typeorm/entities/restaurant-promotion-entity';
import NestjsCriteriaConverter from '@shared/infrastructure/nestjs/criteria/nestjs-criteria-converter';

export default class RestaurantPromotionInfrastructureCommandRepository
  extends TypeOrmRepository<RestaurantPromotionEntity>
  implements RestaurantPromotionRepository
{
  static readonly bindingKey = 'RestaurantPromotionRepository';

  getEntityClass(): EntityTarget<RestaurantPromotionEntity> {
    return RestaurantPromotionEntity;
  }

  async save(item: any): Promise<void> {
    const repository = this.repository();
    await repository.save(item);
  }

  async delete(id: string): Promise<void> {
    const repository = this.repository();
    const promotion = await repository.findOne({
      where: {
        id: id,
      },
    });
    if (promotion) {
      await repository.save({
        ...promotion,
        status: 'DELETED',
      });
    }
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
