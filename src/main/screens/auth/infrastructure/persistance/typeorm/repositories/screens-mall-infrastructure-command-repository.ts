import TypeOrmRepository from '@shared/infrastructure/persistence/typeorm/typeorm-repository';
import { MallEntity } from '@restaurants/auth/infrastructure/persistance/typeorm/entities/mall-entity';
import ScreensMallRepository from '@screens/auth/domain/repositories/screens-mall-repository';
import NestjsCriteriaConverter from '@shared/infrastructure/nestjs/criteria/nestjs-criteria-converter';

export default class ScreensMallInfrastructureCommandRepository
  extends TypeOrmRepository<MallEntity>
  implements ScreensMallRepository
{
  static readonly bindingKey = 'ScreensMallRepository';

  getEntityClass(): any {
    return MallEntity;
  }

  async find(id: string): Promise<any | null> {
    const repository = this.repository();
    const mall = await repository.findOne({
      where: {
        id: id,
        status: 'ACTIVE',
      },
    });
    return mall || null;
  }

  async findAll(criteria?: any): Promise<any[]> {
    const final = NestjsCriteriaConverter.convert(criteria);
    const repository = this.repository();
    const malls = await repository.find(final);
    return malls;
  }
}
