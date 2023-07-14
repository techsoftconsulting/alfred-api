import TypeOrmRepository from '@shared/infrastructure/persistence/typeorm/typeorm-repository';
import NestjsCriteriaConverter from '@shared/infrastructure/nestjs/criteria/nestjs-criteria-converter';
import ScreensPromotionRepository from '@screens/auth/domain/repositories/screens-promotion-repository';
import { VendorPromotionEntity } from '../../../../../../vendor/auth/infrastructure/persistance/typeorm/entities/vendor-promotion-entity';

export default class ScreensPromotionInfrastructureCommandRepository
  extends TypeOrmRepository<VendorPromotionEntity>
  implements ScreensPromotionRepository
{
  static readonly bindingKey = 'ScreensPromotionRepository';

  getEntityClass(): any {
    return VendorPromotionEntity;
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
