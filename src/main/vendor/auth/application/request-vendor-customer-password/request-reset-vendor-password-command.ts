import Command from '@shared/domain/bus/command/command';

export default class RequestResetVendorPasswordCommand extends Command {
  constructor(public readonly email: string) {
    super();
  }

  name(): string {
    return RequestResetVendorPasswordCommand.name;
  }
}
