import CommandHandler from '@shared/domain/bus/command/command-handler';
import { inject } from '@shared/domain/decorators';
import service from '@shared/domain/decorators/service';
import RequestResetVendorPasswordCommand from './request-reset-vendor-password-command';
import RequestResetVendorPasswordUseCase from './request-reset-vendor-password-use-case';

@service()
export default class RequestResetVendorPasswordCommandHandler
  implements CommandHandler
{
  constructor(
    @inject('RequestResetVendorPasswordUseCase')
    private useCase: RequestResetVendorPasswordUseCase,
  ) {}

  getCommandName(): string {
    return RequestResetVendorPasswordCommand.name;
  }

  async handle(command: RequestResetVendorPasswordCommand) {
    await this.useCase.execute({ ...command });
  }
}
