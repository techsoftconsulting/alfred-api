import Command from '@shared/domain/bus/command/command';

export default class RequestResetRestaurantPasswordCommand extends Command {
  constructor(public readonly email: string) {
    super();
  }

  name(): string {
    return RequestResetRestaurantPasswordCommand.name;
  }
}
