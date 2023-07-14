import TypeOrmRepository from '@shared/infrastructure/persistence/typeorm/typeorm-repository';
import { RestaurantTableScheduleEntity } from '@restaurants/auth/infrastructure/persistance/typeorm/entities/restaurant-table-schedule-entity';
import RestaurantTableScheduleRepository from '@restaurants/auth/domain/repositories/restaurant-table-schedule-repository';
import NestjsCriteriaConverter from '@shared/infrastructure/nestjs/criteria/nestjs-criteria-converter';

export default class RestaurantTableScheduleInfrastructureCommandRepository
  extends TypeOrmRepository<RestaurantTableScheduleEntity>
  implements RestaurantTableScheduleRepository
{
  static readonly bindingKey = 'RestaurantTableScheduleRepository';

  getEntityClass(): any {
    return RestaurantTableScheduleEntity;
  }

  async findSchedules(filter: any): Promise<any[]> {
    const final = NestjsCriteriaConverter.convert(filter);
    const repository = this.repository();
    const items = await repository.find(final);
    return items;
  }

  async updateSchedule(item: any): Promise<any> {
    const repository = this.repository();
    const updatedSchedule = await repository.save(item);
    return updatedSchedule;
  }

  async createSchedule(item: any): Promise<any> {
    const repository = this.repository();
    const createdSchedule = await repository.save(item);
    return createdSchedule;
  }

  async deleteSchedule(id: string): Promise<any> {
    const repository = this.repository();
    const schedule = await repository.findOne({
      where: {
        id: id,
      },
    });
    if (schedule) {
      await repository.save({
        ...schedule,
        status: 'DELETED',
      });
    }
  }
}
