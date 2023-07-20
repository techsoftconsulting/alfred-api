import TypeOrmRepository from '@shared/infrastructure/persistence/typeorm/typeorm-repository';
import AdminRestaurantRepository from '@admin/auth/domain/repositories/restaurants/admin-restaurant-repository';
import NestjsCriteriaConverter from '@shared/infrastructure/nestjs/criteria/nestjs-criteria-converter';
import { AdminStoreEntity } from '@admin/auth/infrastructure/persistance/typeorm/entities/admin-store-entity';

export default class AdminRestaurantInfrastructureCommandRepository
  extends TypeOrmRepository<AdminStoreEntity>
  implements AdminRestaurantRepository
{
  static readonly bindingKey = 'AdminRestaurantRepository';

  getEntityClass(): any {
    return AdminStoreEntity;
  }

  async save(restaurant: any): Promise<void> {
    const repository = this.repository();
    const found = await repository.findOne({
      where: {
        id: restaurant?.id,
      },
    });

    if (!found) {
      await repository.save(restaurant);
      return;
    }

    await repository.save({
      ...restaurant,
      uuid: found.uuid,
    });
  }

  async delete(id: string): Promise<void> {
    const repository = this.repository();
    const restaurant = await repository.findOne({
      where: {
        id: id,
      },
    });
    if (restaurant) {
      await repository.save({
        ...restaurant,
        status: 'DELETED',
      });
    }
  }

  async find(id: string): Promise<any | null> {
    const repository = this.repository();
    const restaurant = await repository.findOne({
      where: {
        id: id,
        status: 'ACTIVE',
      },
    });
    return restaurant || null;
  }

  async guardUniqueSlug(slug: string, id: string): Promise<any> {
    const repository = this.repository();
    const existingRestaurant = await repository.findOne({
      where: {
        slug: slug,
        status: 'ACTIVE',
      },
    });

    return !(existingRestaurant && existingRestaurant.id !== id);
  }

  async findAll(filters?: any): Promise<any[]> {
    const final = NestjsCriteriaConverter.convert(filters);
    const repository = this.repository();
    const restaurants = await repository.find(final);
    return restaurants;
  }
}
