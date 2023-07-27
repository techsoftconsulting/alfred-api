import CommandHandler from '@shared/domain/bus/command/command-handler';
import { inject } from '@shared/domain/decorators';
import service from '@shared/domain/decorators/service';
import RequestResetRestaurantPasswordCommand from '@restaurants/auth/application/request-reset-restaurant-password/request-reset-restaurant-password-command';
import RequestResetRestaurantPasswordUseCase from '@restaurants/auth/application/request-reset-restaurant-password/request-reset-restaurant-password-use-case';

@service()
export default class RequestResetRestaurantPasswordCommandHandler
  implements CommandHandler
{
  constructor(
    @inject('RequestResetRestaurantPasswordUseCase')
    private useCase: RequestResetRestaurantPasswordUseCase,
  ) {}

  getCommandName(): string {
    return RequestResetRestaurantPasswordCommand.name;
  }

  async handle(command: RequestResetRestaurantPasswordCommand) {
    await this.useCase.execute({ ...command });
  }
}
