import CommandHandler from '@shared/domain/bus/command/command-handler';
import { inject } from '@shared/domain/decorators';
import service from '@shared/domain/decorators/service';
import AuthenticateCustomerAccountCommand from './authenticate-customer-account-command';
import AuthenticateCustomerAccountUseCase from './authenticate-customer-account-use-case';

@service()
export default class AuthenticateCustomerAccountCommandHandler
  implements CommandHandler
{
  constructor(
    @inject('AuthenticateCustomerAccountUseCase')
    private authenticator: AuthenticateCustomerAccountUseCase,
  ) {}

  getCommandName(): string {
    return AuthenticateCustomerAccountCommand.name;
  }

  async handle(command: AuthenticateCustomerAccountCommand): Promise<any> {
    try {
      return await this.authenticator.execute({ ...command });
    } catch (e) {
      throw new Error(e.message);
    }
  }
}
