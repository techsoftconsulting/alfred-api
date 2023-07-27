import CommandHandler from '@shared/domain/bus/command/command-handler';
import { inject } from '@shared/domain/decorators';
import service from '@shared/domain/decorators/service';
import PasswordHasher from '@shared/domain/utils/password-hasher';
import ResetCustomerPasswordCommand from './reset-customer-password-command';
import ResetCustomerPasswordUseCase from './reset-customer-password-use-case';

@service()
export default class ResetCustomerPasswordCommandHandler
  implements CommandHandler
{
  constructor(
    @inject('ResetCustomerPasswordUseCase')
    private useCase: ResetCustomerPasswordUseCase,
    @inject('utils.passwordHasher')
    private passwordHasher: PasswordHasher,
  ) {}

  getCommandName(): string {
    return ResetCustomerPasswordCommand.name;
  }

  async handle(command: ResetCustomerPasswordCommand) {
    await this.useCase.execute({
      email: command.email,
      resetToken: command.resetToken,
      newPassword: await this.passwordHasher.hashPassword(command.newPassword),
    });
  }
}
