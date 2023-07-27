import CommandHandler from '@shared/domain/bus/command/command-handler';
import { inject } from '@shared/domain/decorators';
import service from '@shared/domain/decorators/service';
import RequestResetCustomerPasswordUseCase from './request-reset-customer-password-use-case';
import RequestResetCustomerPasswordCommand from './request-reset-customer-password-command';

@service()
export default class RequestResetCustomerPasswordCommandHandler
  implements CommandHandler
{
  constructor(
    @inject('RequestResetCustomerPasswordUseCase')
    private useCase: RequestResetCustomerPasswordUseCase,
  ) {}

  getCommandName(): string {
    return RequestResetCustomerPasswordCommand.name;
  }

  async handle(command: RequestResetCustomerPasswordCommand) {
    await this.useCase.execute({ ...command });
  }
}
