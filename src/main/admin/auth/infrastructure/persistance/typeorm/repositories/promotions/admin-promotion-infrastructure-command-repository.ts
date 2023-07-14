import TypeOrmRepository from '@shared/infrastructure/persistence/typeorm/typeorm-repository';
import { AdminPromotionEntity } from '@admin/auth/infrastructure/persistance/typeorm/entities/admin-promotion-entity';
import AdminPromotionRepository from '@admin/auth/domain/repositories/promotions/admin-promotion-repository';
import NestjsCriteriaConverter from '@shared/infrastructure/nestjs/criteria/nestjs-criteria-converter';

export default class AdminPromotionInfrastructureCommandRepository
  extends TypeOrmRepository<AdminPromotionEntity>
  implements AdminPromotionRepository
{
  static readonly bindingKey = 'AdminPromotionRepository';

  getEntityClass(): any {
    // Replace with the actual entity class for the promotion
    return AdminPromotionEntity;
  }

  async save(item: any): Promise<void> {
    const repository = this.repository();
    await repository.save(item);
  }

  async delete(id: string): Promise<void> {
    const repository = this.repository();
    const item = await repository.findOne({
      where: {
        id: id,
      },
    });
    if (item) {
      await repository.remove(item);
    }
  }

  async find(id: string): Promise<any | null> {
    const repository = this.repository();
    const item = await repository.findOne({
      where: {
        id: id,
        status: 'ACTIVE',
      },
    });
    return item || null;
  }

  async findAll(filters: any): Promise<any[]> {
    const finalFilters = filters
      ? NestjsCriteriaConverter.convert(filters)
      : {};

    const repository = this.repository();
    const items = await repository.find(finalFilters);
    return items;
  }
}
