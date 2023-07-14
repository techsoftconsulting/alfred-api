import TypeOrmRepository from '@shared/infrastructure/persistence/typeorm/typeorm-repository';
import RestaurantMallRepository from '@restaurants/auth/domain/repositories/restaurant-mall-repository';
import { MallEntity } from '@restaurants/auth/infrastructure/persistance/typeorm/entities/mall-entity';
import NestjsCriteriaConverter from '@shared/infrastructure/nestjs/criteria/nestjs-criteria-converter';

export default class RestaurantMallInfrastructureCommandRepository
  extends TypeOrmRepository<MallEntity>
  implements RestaurantMallRepository
{
  static readonly bindingKey = 'RestaurantMallRepository';

  getEntityClass() {
    return MallEntity;
  }

  async find(id: string): Promise<any | null> {
    const repository = this.repository();
    const entity = await repository.findOne({
      where: {
        id: id,
      },
    });
    return entity || null;
  }

  async findAll(criteria?: any): Promise<any[]> {
    const final = NestjsCriteriaConverter.convert(criteria);
    const repository = this.repository();
    const entities = await repository.find(final);
    return entities;
  }
}
