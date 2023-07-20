import CommandHandler from '@shared/domain/bus/command/command-handler';
import { inject } from '@shared/domain/decorators';
import service from '@shared/domain/decorators/service';
import AuthenticateRestaurantHostAccountCommand from '@restaurants/auth/application/authenticate-host/authenticate-restaurant-host-account-command';
import AuthenticateRestaurantHostAccountUseCase from '@restaurants/auth/application/authenticate-host/authenticate-restaurant-host-account-use-case';

@service()
export default class AuthenticateRestaurantHostAccountCommandHandler
  implements CommandHandler
{
  constructor(
    @inject('AuthenticateRestaurantHostAccountUseCase')
    private authenticator: AuthenticateRestaurantHostAccountUseCase,
  ) {}

  getCommandName(): string {
    return AuthenticateRestaurantHostAccountCommand.name;
  }

  async handle(
    command: AuthenticateRestaurantHostAccountCommand,
  ): Promise<any> {
    try {
      return await this.authenticator.execute({ ...command });
    } catch (e) {
      throw new Error(e.message);
    }
  }
}
