import Command from '@shared/domain/bus/command/command';

export default class RequestResetAdminPasswordCommand extends Command {
  constructor(public readonly email: string) {
    super();
  }

  name(): string {
    return RequestResetAdminPasswordCommand.name;
  }
}
