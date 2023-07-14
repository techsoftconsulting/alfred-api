import NestjsCriteriaConverter from '@shared/infrastructure/nestjs/criteria/nestjs-criteria-converter';
import TypeOrmRepository from '@shared/infrastructure/persistence/typeorm/typeorm-repository';
import { AdminRoleEntity } from '../entities/admin-role-entity';

export default class AdminRoleCommandInfrastructureRepository extends TypeOrmRepository<AdminRoleEntity> {
  static readonly bindingKey = 'AdminRoleCommandRepository';

  getEntityClass() {
    return AdminRoleEntity;
  }

  async getAll(filters?: any) {
    const finalFilters = filters
      ? NestjsCriteriaConverter.convert(filters)
      : {};
    return this.repository().find(finalFilters);
  }

  async create(data: {
    id: string;
    name: string;
    permissions: any[];
    isSuperAdmin?: boolean;
    status: string;
  }) {
    await this.repository().save(new AdminRoleEntity(data));
  }

  count(filters?: any) {
    return this.repository().count(filters);
  }

  async update(
    id: string,
    data: Partial<{ name: string; permissions: any[]; isSuperAdmin?: boolean }>,
  ) {
    await this.repository().update({ id: id }, new AdminRoleEntity(data));
  }

  async get(id: string) {
    return await this.repository().findOne({
      where: { id: id },
    });
  }

  async delete(id: string) {
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
}
