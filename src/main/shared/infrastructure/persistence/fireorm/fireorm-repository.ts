import AggregateRoot from '@shared/domain/aggregate/aggregate-root';
import {
  BaseFirestoreRepository,
  EntityConstructorOrPath,
  getRepository,
  IEntity,
} from 'fireorm';

export default abstract class FireOrmRepository<T extends IEntity> {
  constructor() {}

  abstract getEntityClass(): EntityConstructorOrPath<T>;

  protected async save(
    aggregateRoot: AggregateRoot<any>,
    dataMapper: any,
  ): Promise<void> {
    const entity = dataMapper.toPersistence(aggregateRoot);
    await this.repository().create(entity);
  }

  protected async remove(entity: AggregateRoot<T>): Promise<void> {
    this.repository().delete(entity.getId());
  }

  protected async findById(id: string): Promise<T> {
    return await this.repository().findById(id);
  }

  protected async update(item: T): Promise<void> {
    await this.repository().update(item);
  }

  protected repository(): BaseFirestoreRepository<T> {
    const entityClass = this.getEntityClass();
    return getRepository(entityClass);
  }
}
