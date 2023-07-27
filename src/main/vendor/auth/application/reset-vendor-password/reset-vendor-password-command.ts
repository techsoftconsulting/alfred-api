import Command from '@shared/domain/bus/command/command';

export default class ResetVendorPasswordCommand extends Command {
  constructor(
    public readonly email: string,
    public readonly resetToken: string,
    public readonly newPassword: string,
  ) {
    super();
  }

  name(): string {
    return ResetVendorPasswordCommand.name;
  }
}
