import CommandHandler from '@shared/domain/bus/command/command-handler';
import { inject } from '@shared/domain/decorators';
import service from '@shared/domain/decorators/service';
import RequestResetAdminPasswordCommand from '@admin/auth/application/request-reset-admin-password/request-reset-admin-password-command';
import RequestResetAdminPasswordUseCase from '@admin/auth/application/request-reset-admin-password/request-reset-admin-password-use-case';

@service()
export default class RequestResetAdminPasswordCommandHandler
  implements CommandHandler
{
  constructor(
    @inject('RequestResetAdminPasswordUseCase')
    private useCase: RequestResetAdminPasswordUseCase,
  ) {}

  getCommandName(): string {
    return RequestResetAdminPasswordCommand.name;
  }

  async handle(command: RequestResetAdminPasswordCommand) {
    await this.useCase.execute({ ...command });
  }
}
