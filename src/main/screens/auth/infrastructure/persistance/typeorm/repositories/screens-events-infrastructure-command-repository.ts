import TypeOrmRepository from '@shared/infrastructure/persistence/typeorm/typeorm-repository';
import ScreenEventsRepository, {
  ScreenEvent,
} from '@screens/auth/domain/repositories/screen-events-repository';
import { ScreenEventsEntity } from '@screens/auth/infrastructure/persistance/typeorm/entities/screen-events-entity';

export default class ScreensEventsInfrastructureCommandRepository
  extends TypeOrmRepository<ScreenEventsEntity>
  implements ScreenEventsRepository
{
  static readonly bindingKey = 'ScreenEventsRepository';

  getEntityClass(): any {
    return ScreenEventsEntity;
  }

  async track(event: ScreenEvent): Promise<void> {
    const repository = this.repository();
    await repository.save(event);
  }
}
