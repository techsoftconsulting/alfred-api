import TypeOrmRepository from '@shared/infrastructure/persistence/typeorm/typeorm-repository';
import RestaurantRepository from '@restaurants/auth/domain/repositories/restaurant-repository';
import { getRepository } from 'typeorm';
import { RestaurantCategoryEntity } from '@restaurants/auth/infrastructure/persistance/typeorm/entities/restaurant-category-entity';
import { StoreEntity } from '@restaurants/auth/infrastructure/persistance/typeorm/entities/store-entity';

export default class RestaurantInfrastructureCommandRepository
  extends TypeOrmRepository<StoreEntity>
  implements RestaurantRepository
{
  static readonly bindingKey = 'RestaurantRepository';

  getEntityClass(): any {
    return StoreEntity;
  }

  async getProfileBySlug(slug: string): Promise<any | undefined> {
    const repository = this.repository();
    const profile = await repository.findOne({ where: { slug } });
    return profile || undefined;
  }

  async getProfileById(id: string): Promise<any | undefined> {
    const repository = this.repository();
    const profile = await repository.findOne({
      where: {
        id: id,
      },
    });
    return profile || undefined;
  }

  async findCategories(): Promise<any[]> {
    return getRepository(RestaurantCategoryEntity).find();
  }

  async updateRestaurant(restaurant: any): Promise<any> {
    const repository = this.repository();
    const updatedRestaurant = await repository.save(restaurant);
    return updatedRestaurant;
  }
}
