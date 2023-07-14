import CommandHandler from '@shared/domain/bus/command/command-handler';
import { inject } from '@shared/domain/decorators';
import service from '@shared/domain/decorators/service';
import AuthenticateRestaurantAccountUseCase from './authenticate-restaurant-account-use-case';
import AuthenticateRestaurantAccountCommand from '@restaurants/auth/application/authenticate/authenticate-restaurant-account-command';

@service()
export default class AuthenticateRestaurantAccountCommandHandler
  implements CommandHandler
{
  constructor(
    @inject('AuthenticateRestaurantAccountUseCase')
    private authenticator: AuthenticateRestaurantAccountUseCase,
  ) {}

  getCommandName(): string {
    return AuthenticateRestaurantAccountCommand.name;
  }

  async handle(command: AuthenticateRestaurantAccountCommand): Promise<any> {
    try {
      return await this.authenticator.execute({ ...command });
    } catch (e) {
      throw new Error(e.message);
    }
  }
}
