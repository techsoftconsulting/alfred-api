import CommandHandler from '@shared/domain/bus/command/command-handler';
import { inject } from '@shared/domain/decorators';
import service from '@shared/domain/decorators/service';
import PasswordHasher from '@shared/domain/utils/password-hasher';
import ResetAdminPasswordCommand from '@admin/auth/application/reset-admin-password/reset-admin-password-command';
import ResetAdminPasswordUseCase from '@admin/auth/application/reset-admin-password/reset-admin-password-use-case';

@service()
export default class ResetAdminPasswordCommandHandler
  implements CommandHandler
{
  constructor(
    @inject('ResetAdminPasswordUseCase')
    private useCase: ResetAdminPasswordUseCase,
    @inject('utils.passwordHasher')
    private passwordHasher: PasswordHasher,
  ) {}

  getCommandName(): string {
    return ResetAdminPasswordCommand.name;
  }

  async handle(command: ResetAdminPasswordCommand) {
    await this.useCase.execute({
      email: command.email,
      resetToken: command.resetToken,
      newPassword: await this.passwordHasher.hashPassword(command.newPassword),
    });
  }
}
