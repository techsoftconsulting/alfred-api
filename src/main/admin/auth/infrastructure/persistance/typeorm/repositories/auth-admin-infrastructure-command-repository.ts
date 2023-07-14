import AdminAuthUser from '@admin/auth/domain/models/admin-auth-user';
import AuthAdminCommandRepository from '@admin/auth/domain/repositories/auth-admin-command-repository';
import NestjsCriteriaConverter from '@shared/infrastructure/nestjs/criteria/nestjs-criteria-converter';
import TypeOrmRepository from '@shared/infrastructure/persistence/typeorm/typeorm-repository';
import AdminEntity from '../entities/admin-entity';
import AdminAuthMapper from '../mapper/admin-auth-mapper';
import { inject } from '@shared/domain/decorators';
import AdminRoleCommandInfrastructureRepository from '@admin/auth/infrastructure/persistance/typeorm/repositories/admin-role-infrastructure-command-repository';

export default class AuthAdminInfrastructureCommandRepository
  extends TypeOrmRepository<AdminEntity>
  implements AuthAdminCommandRepository
{
  static readonly bindingKey = 'AuthAdminCommandRepository';

  constructor(
    @inject('AdminRoleCommandRepository')
    private roleFinder: AdminRoleCommandInfrastructureRepository,
  ) {
    super();
  }

  getEntityClass() {
    return AdminEntity;
  }

  async findUser(email: string): Promise<AdminAuthUser> {
    const result = await this.repository().findOne({
      where: { email: email },
    });

    if (!result) return null;

    const role = await this.roleFinder.get(result.roleId);

    if (!role) throw new Error('admin_role_doesnt_exists');

    return AdminAuthMapper.toDomain(result, role);
  }

  async findUserById(userId: string): Promise<AdminAuthUser> {
    const result = await this.repository().findOne({
      where: { id: userId },
    });

    if (!result) return null;

    const role = await this.roleFinder.get(result.roleId);
    if (!role) throw new Error('admin_role_doesnt_exists');
    return AdminAuthMapper.toDomain(result, role);
  }

  async register(user: AdminAuthUser): Promise<void> {
    const entity = AdminAuthMapper.toPersistence(user);
    await this.repository().save(entity);
  }

  async exists(email: string): Promise<boolean> {
    return (
      (await this.repository().count({
        where: {
          email: email,
        },
      })) > 0
    );
  }

  async updateUser(user: AdminAuthUser): Promise<void> {
    const entity = AdminAuthMapper.toPersistence(user);

    await this.repository().update({ id: entity.id }, entity);
  }

  async changePassword(user: AdminAuthUser): Promise<void> {
    const entity = AdminAuthMapper.toPersistence(user);

    await this.repository().update({ id: entity.id }, entity);
  }

  getAll(filters?: any) {
    const finalFilters = filters
      ? NestjsCriteriaConverter.convert(filters)
      : {};
    return this.repository().find(finalFilters);
  }

  count(filters?: any) {
    const finalFilters = filters
      ? NestjsCriteriaConverter.convert(filters)
      : {};
    return this.repository().count(finalFilters);
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
