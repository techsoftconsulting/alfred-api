import CommandHandler from '@shared/domain/bus/command/command-handler';
import { inject } from '@shared/domain/decorators';
import service from '@shared/domain/decorators/service';
import AuthenticateVendorAccountCommand from './authenticate-vendor-account-command';
import AuthenticateVendorAccountUseCase from './authenticate-vendor-account-use-case';

@service()
export default class AuthenticateVendorAccountCommandHandler
  implements CommandHandler
{
  constructor(
    @inject('AuthenticateVendorAccountUseCase')
    private authenticator: AuthenticateVendorAccountUseCase,
  ) {}

  getCommandName(): string {
    return AuthenticateVendorAccountCommand.name;
  }

  async handle(command: AuthenticateVendorAccountCommand): Promise<any> {
    try {
      return await this.authenticator.execute({ ...command });
    } catch (e) {
      throw new Error(e.message);
    }
  }
}
