import TypeOrmRepository from '@shared/infrastructure/persistence/typeorm/typeorm-repository';
import { EntityTarget } from 'typeorm';
import NestjsCriteriaConverter from '@shared/infrastructure/nestjs/criteria/nestjs-criteria-converter';
import { VendorPromotionEntity } from '../entities/vendor-promotion-entity';
import VendorPromotionRepository from '../../../../domain/repositories/vendor-promotion-repository';

export default class VendorPromotionInfrastructureCommandRepository
  extends TypeOrmRepository<VendorPromotionEntity>
  implements VendorPromotionRepository
{
  static readonly bindingKey = 'VendorPromotionRepository';

  getEntityClass(): EntityTarget<VendorPromotionEntity> {
    return VendorPromotionEntity;
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
