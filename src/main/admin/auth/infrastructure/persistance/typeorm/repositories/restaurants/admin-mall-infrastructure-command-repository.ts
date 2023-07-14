import TypeOrmRepository from '@shared/infrastructure/persistence/typeorm/typeorm-repository';
import { AdminMallEntity } from '@admin/auth/infrastructure/persistance/typeorm/entities/admin-mall-entity';
import AdminMallRepository from '@admin/auth/domain/repositories/restaurants/admin-mall-repository';
import NestjsCriteriaConverter from '@shared/infrastructure/nestjs/criteria/nestjs-criteria-converter';

export default class AdminMallInfrastructureCommandRepository
  extends TypeOrmRepository<AdminMallEntity>
  implements AdminMallRepository
{
  static readonly bindingKey = 'AdminMallRepository';

  getEntityClass(): any {
    return AdminMallEntity;
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
      await repository.save({
        ...item,
        status: 'DELETED',
      });
    }
  }

  async find(id: string): Promise<any | null> {
    const repository = this.repository();
    const item = await repository.findOne({
      where: {
        id: id,
      },
    });
    return item || null;
  }

  async findAll(filters?: any): Promise<any[]> {
    const final = NestjsCriteriaConverter.convert(filters);
    const repository = this.repository();
    const items = await repository.find(final);
    return items;
  }
}
