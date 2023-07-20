import TypeOrmRepository from '@shared/infrastructure/persistence/typeorm/typeorm-repository';
import { AdminRestaurantCategoryEntity } from '@admin/auth/infrastructure/persistance/typeorm/entities/admin-restaurant-category-entity';
import AdminRestaurantCategoryRepository from '@admin/auth/domain/repositories/restaurants/admin-restaurant-category-repository';
import NestjsCriteriaConverter from '@shared/infrastructure/nestjs/criteria/nestjs-criteria-converter'; // Replace with the actual path to the AdminRestaurantCategoryRepository interface

export default class AdminRestaurantCategoryInfrastructureCommandRepository
  extends TypeOrmRepository<AdminRestaurantCategoryEntity>
  implements AdminRestaurantCategoryRepository
{
  static readonly bindingKey = 'AdminRestaurantCategoryRepository';

  getEntityClass(): any {
    return AdminRestaurantCategoryEntity;
  }

  async save(category: any): Promise<void> {
    const repository = this.repository();
    const found = await repository.findOne({
      where: {
        id: category?.id,
      },
    });

    if (!found) {
      await repository.save(category);
      return;
    }

    await repository.save({
      ...category,
      uuid: found.uuid,
    });
  }

  async delete(id: string): Promise<void> {
    const repository = this.repository();
    const category = await repository.findOne({
      where: {
        id: id,
      },
    });
    if (category) {
      await repository.save({
        ...category,
        status: 'DELETED',
      });
    }
  }

  async find(id: string): Promise<any | null> {
    const repository = this.repository();
    const category = await repository.findOne({
      where: {
        id: id,
      },
    });
    return category || null;
  }

  async findAll(filters?: any): Promise<any[]> {
    const final = NestjsCriteriaConverter.convert(filters);
    const repository = this.repository();
    const categories = await repository.find(final);
    return categories;
  }
}
