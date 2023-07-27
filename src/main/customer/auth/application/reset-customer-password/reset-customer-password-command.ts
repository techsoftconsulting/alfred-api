import Command from '@shared/domain/bus/command/command';

export default class ResetCustomerPasswordCommand extends Command {
  constructor(
    public readonly email: string,
    public readonly resetToken: string,
    public readonly newPassword: string,
  ) {
    super();
  }

  name(): string {
    return ResetCustomerPasswordCommand.name;
  }
}
