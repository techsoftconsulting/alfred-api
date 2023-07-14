import TypeOrmRepository from '@shared/infrastructure/persistence/typeorm/typeorm-repository';
import { StoreEntity } from '@restaurants/auth/infrastructure/persistance/typeorm/entities/store-entity';
import VendorRepository from '../../../../domain/repositories/vendor-repository';
import { getRepository } from 'typeorm';
import { RestaurantCategoryEntity } from '@restaurants/auth/infrastructure/persistance/typeorm/entities/restaurant-category-entity';

export default class VendorInfrastructureCommandRepository
  extends TypeOrmRepository<StoreEntity>
  implements VendorRepository
{
  static readonly bindingKey = 'VendorRepository';

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

  async update(item: any): Promise<any> {
    const repository = this.repository();
    const updatedRestaurant = await repository.save(item);
    return updatedRestaurant;
  }
}
