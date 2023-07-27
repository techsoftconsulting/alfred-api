import Command from '@shared/domain/bus/command/command';

export default class RequestResetCustomerPasswordCommand extends Command {
  constructor(public readonly email: string) {
    super();
  }

  name(): string {
    return RequestResetCustomerPasswordCommand.name;
  }
}
