import TypeOrmRepository from '@shared/infrastructure/persistence/typeorm/typeorm-repository';
import RestaurantAreaRepository from '@restaurants/auth/domain/repositories/restaurant-area-repository';
import { RestaurantAreaEntity } from '@restaurants/auth/infrastructure/persistance/typeorm/entities/restaurant-area-entity';
import NestjsCriteriaConverter from '@shared/infrastructure/nestjs/criteria/nestjs-criteria-converter';

export default class RestaurantAreaInfrastructureCommandRepository
  extends TypeOrmRepository<RestaurantAreaEntity>
  implements RestaurantAreaRepository
{
  static readonly bindingKey = 'RestaurantAreaRepository';

  getEntityClass() {
    return RestaurantAreaEntity;
  }

  async findAreas(filter?: any, pagination?: any, sort?: any): Promise<any[]> {
    const final = NestjsCriteriaConverter.convert(filter);
    const repository = this.repository();
    const areas = await repository.find(final);
    return areas;
  }

  async updateArea(item: any): Promise<any> {
    const repository = this.repository();
    const updatedArea = await repository.save(item);
    return updatedArea;
  }

  async createArea(item: any): Promise<any> {
    const repository = this.repository();
    const createdArea = await repository.save(item);
    return createdArea;
  }

  async deleteArea(id: string): Promise<any> {
    const repository = this.repository();
    const area = await repository.findOne({
      where: {
        id: id,
      },
    });

    if (!area) {
      throw new Error('Area not found');
    }

    await repository.save({
      ...area,
      status: 'DELETED',
    });
    return area;
  }
}
