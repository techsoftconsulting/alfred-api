import CommandHandler from '@shared/domain/bus/command/command-handler';
import { inject } from '@shared/domain/decorators';
import service from '@shared/domain/decorators/service';
import PasswordHasher from '@shared/domain/utils/password-hasher';
import ResetVendorPasswordCommand from './reset-vendor-password-command';
import ResetVendorPasswordUseCase from './reset-vendor-password-use-case';

@service()
export default class ResetVendorPasswordCommandHandler
  implements CommandHandler
{
  constructor(
    @inject('ResetVendorPasswordUseCase')
    private useCase: ResetVendorPasswordUseCase,
    @inject('utils.passwordHasher')
    private passwordHasher: PasswordHasher,
  ) {}

  getCommandName(): string {
    return ResetVendorPasswordCommand.name;
  }

  async handle(command: ResetVendorPasswordCommand) {
    await this.useCase.execute({
      email: command.email,
      resetToken: command.resetToken,
      newPassword: await this.passwordHasher.hashPassword(command.newPassword),
    });
  }
}
