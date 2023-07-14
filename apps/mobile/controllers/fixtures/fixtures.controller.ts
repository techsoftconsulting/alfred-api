import AdminAuthUser from '@admin/auth/domain/models/admin-auth-user';
import AdminRoleCommandInfrastructureRepository from '@admin/auth/infrastructure/persistance/typeorm/repositories/admin-role-infrastructure-command-repository';
import AuthAdminInfrastructureCommandRepository from '@admin/auth/infrastructure/persistance/typeorm/repositories/auth-admin-infrastructure-command-repository';
import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import CommandBus from '@shared/domain/bus/command/command-bus';
import QueryBus from '@shared/domain/bus/query/query-bus';
import Criteria from '@shared/domain/criteria/criteria';
import Filters from '@shared/domain/criteria/filters';
import { inject } from '@shared/domain/decorators';
import Id from '@shared/domain/id/id';
import MultipartHandler from '@shared/domain/storage/multipart-handler';
import PasswordHasher from '@shared/domain/utils/password-hasher';
import Collection from '@shared/domain/value-object/collection';
import ApiController from '@shared/infrastructure/controller/api-controller';

@ApiTags('Fixtures')
@Controller({
  path: 'fixtures',
})
export class FixturesController extends ApiController {
  constructor(
    @inject('command.bus')
    commandBus: CommandBus,
    @inject('query.bus')
    queryBus: QueryBus,
    @inject('multipart.handler')
    multipartHandler: MultipartHandler<Request, Response>,
    @inject('AuthAdminCommandRepository')
    private adminRepo: AuthAdminInfrastructureCommandRepository,
    @inject('AdminRoleCommandRepository')
    private adminRoleRepo: AdminRoleCommandInfrastructureRepository,
    @inject('utils.passwordHasher')
    private passwordHasher: PasswordHasher,
  ) {
    super(commandBus, queryBus, multipartHandler);
  }

  @Post('admins')
  @ApiOperation({
    summary: 'Crear super admin admin',
  })
  async admins(): Promise<any> {
    const permissions = [];

    let superAdminRoleId = null;
    const roles = await this.adminRoleRepo.getAll(
      new Criteria({
        order: new Collection([]),
        filters: Filters.fromValues({ name: 'Super Admin' }),
      }),
    );

    if (roles.length === 0) {
      superAdminRoleId = 'SUPER_ADMIN';

      await this.adminRoleRepo.create({
        id: superAdminRoleId,
        name: 'Super Admin',
        permissions: permissions,
        isSuperAdmin: true,
        status: 'ACTIVE',
      });
    } else {
      superAdminRoleId = roles.pop().id;
    }

    const plainPassword = '12345678';

    const email = 'admin@admin.com';
    const hashedPassword = await this.passwordHasher.hashPassword(
      plainPassword,
    );

    if (!(await this.adminRepo.exists(email))) {
      await this.adminRepo.register(
        AdminAuthUser.fromPrimitives({
          id: new Id().value,
          email: email,
          firstName: 'Super',
          lastName: 'Admin',
          role: {
            id: superAdminRoleId,
            name: 'Super Admin',
            permissions: permissions,
            isSuperAdmin: true,
          },
          password: hashedPassword,
          plainPassword: plainPassword,
        }),
      );
    }
  }
}
