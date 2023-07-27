import EventBus from '@shared/domain/bus/event/event-bus';
import { inject } from '@shared/domain/decorators';
import service from '@shared/domain/decorators/service';
import AuthAdminCommandRepository from '@admin/auth/domain/repositories/auth-admin-command-repository';

@service()
export default class ResetAdminPasswordUseCase {
  constructor(
    @inject('AuthAdminCommandRepository')
    private repository: AuthAdminCommandRepository,
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

    user.overridePassword(params.newPassword);

    await this.repository.updateUser(user);

    this.eventBus.publish(user.pullDomainEvents());
  }
}
