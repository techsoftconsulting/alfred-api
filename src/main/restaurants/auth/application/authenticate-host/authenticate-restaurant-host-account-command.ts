import Command from '@shared/domain/bus/command/command';

export default class AuthenticateRestaurantHostAccountCommand extends Command {
  constructor(public readonly email: string, public readonly password: string) {
    super();
  }

  name(): string {
    return AuthenticateRestaurantHostAccountCommand.name;
  }
}
