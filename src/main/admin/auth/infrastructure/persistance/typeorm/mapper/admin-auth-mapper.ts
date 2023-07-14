import AdminAuthUser from '@admin/auth/domain/models/admin-auth-user';
import AdminEntity from '../entities/admin-entity';
import { AdminRoleEntity } from '@admin/auth/infrastructure/persistance/typeorm/entities/admin-role-entity';

export default class AdminAuthMapper {
  static toDomain(
    plainValues: AdminEntity,
    role: AdminRoleEntity,
  ): AdminAuthUser {
    return AdminAuthUser.fromPrimitives({
      id: plainValues.id,
      email: plainValues.email,
      password: plainValues.password,
      firstName: plainValues.firstName,
      lastName: plainValues.lastName,
      role: {
        id: role.id,
        name: role.name,
        permission: role.permissions,
        status: role.status,
      },
    });
  }

  static toPersistence(user: AdminAuthUser): AdminEntity {
    const primitives = user.toPrimitives();

    return new AdminEntity({
      id: primitives.id,
      email: primitives.email,
      firstName: primitives.firstName,
      lastName: primitives.lastName,
      password: user.password,
      roleId: primitives.role.id,
    });
  }
}
