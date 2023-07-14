import AggregateRoot from '@shared/domain/aggregate/aggregate-root';
import {
  EntityManager,
  EntityTarget,
  getConnectionManager,
  getRepository,
  Repository,
} from 'typeorm';

export default abstract class TypeOrmRepository<T> {
  protected entityManager: EntityManager;

  constructor() {
    const connManager = getConnectionManager();
    const x = connManager.create({
      type: 'postgres',
      entities: [__dirname + '/../../../../../main/**/*-entity{.ts,.js}'],
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT as any,
      database: process.env.DATABASE_NAME,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      migrations: ['dist/migrations/!*.{ts,js}'],
      migrationsTableName: 'typeorm_migrations',
      logger: 'file',
      synchronize: false, // process.env.NODE_ENV === 'development',
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    });
    x.initialize().then(() => {
      /*  console.log('db ready');*/
    });
  }

  abstract getEntityClass(): EntityTarget<T>;

  protected async save(
    aggregateRoot: AggregateRoot<any>,
    dataMapper: any,
  ): Promise<void> {
    const entity = dataMapper.toPersistence(aggregateRoot);

    await this.repository().save(entity);
  }

  protected async remove<T = any>(entity: AggregateRoot<T>): Promise<void> {
    await this.repository().remove(entity as any);
  }

  protected repository(): Repository<T> {
    const name = this.getEntityClass();
    return getRepository(name);
  }
}
