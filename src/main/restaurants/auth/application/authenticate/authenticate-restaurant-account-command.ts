import Command from '@shared/domain/bus/command/command';

export default class AuthenticateRestaurantAccountCommand extends Command {
  constructor(public readonly email: string, public readonly password: string) {
    super();
  }

  name(): string {
    return AuthenticateRestaurantAccountCommand.name;
  }
}
