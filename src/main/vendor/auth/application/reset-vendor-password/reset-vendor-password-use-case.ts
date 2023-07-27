import EventBus from '@shared/domain/bus/event/event-bus';
import { inject } from '@shared/domain/decorators';
import service from '@shared/domain/decorators/service';
import VendorAccountsRepository from '../../domain/repositories/vendor-accounts-repository';

@service()
export default class ResetVendorPasswordUseCase {
  constructor(
    @inject('VendorAccountsRepository')
    private repository: VendorAccountsRepository,
    @inject('event.bus')
    private eventBus: EventBus,
  ) {}

  async execute(params: {
    resetToken: string;
    newPassword: string;
    email: string;
  }) {
    const user = await this.repository.findByResetPasswordToken(
      params.resetToken,
    );

    if (!user) {
      throw new Error('CREDENTIALS_NOT_FOUND');
    }

    if (user.email !== params.email) {
      throw new Error('CREDENTIALS_NOT_FOUND');
    }

    await this.repository.saveAccount({
      ...user,
      password: params.newPassword,
      passwordResetToken: null,
    });
  }
}
