import CommandHandler from '@shared/domain/bus/command/command-handler';
import { inject } from '@shared/domain/decorators';
import service from '@shared/domain/decorators/service';
import PasswordHasher from '@shared/domain/utils/password-hasher';
import ResetRestaurantPasswordCommand from '@restaurants/auth/application/reset-restaurant-password/reset-restaurant-password-command';
import ResetRestaurantPasswordUseCase from '@restaurants/auth/application/reset-restaurant-password/reset-restaurant-password-use-case';

@service()
export default class ResetRestaurantPasswordCommandHandler
  implements CommandHandler
{
  constructor(
    @inject('ResetRestaurantPasswordUseCase')
    private useCase: ResetRestaurantPasswordUseCase,
    @inject('utils.passwordHasher')
    private passwordHasher: PasswordHasher,
  ) {}

  getCommandName(): string {
    return ResetRestaurantPasswordCommand.name;
  }

  async handle(command: ResetRestaurantPasswordCommand) {
    await this.useCase.execute({
      email: command.email,
      resetToken: command.resetToken,
      newPassword: await this.passwordHasher.hashPassword(command.newPassword),
    });
  }
}
