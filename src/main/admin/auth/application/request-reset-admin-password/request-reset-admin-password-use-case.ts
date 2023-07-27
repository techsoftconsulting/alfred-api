import EventBus from '@shared/domain/bus/event/event-bus';
import { inject } from '@shared/domain/decorators';
import service from '@shared/domain/decorators/service';
import SimpleCodeGenerator from '@shared/infrastructure/utils/simple-code-generator';
import AuthAdminCommandRepository from '@admin/auth/domain/repositories/auth-admin-command-repository';
import EmailSender from '@shared/domain/email/email-sender';
import EmailContentParser from '@shared/domain/email/email-content-parser';
import EmailMessage from '@shared/domain/email/email-message';

@service()
export default class RequestResetAdminPasswordUseCase {
  constructor(
    @inject('AuthAdminCommandRepository')
    private repository: AuthAdminCommandRepository,
    @inject('event.bus')
    private eventBus: EventBus,
    @inject('simple.code.generator')
    private codeGenerator: SimpleCodeGenerator,
    @inject('services.email')
    private mailer: EmailSender,
    @inject('email.content.parser')
    private emailContentParser: EmailContentParser,
  ) {}

  async execute(params: { email: string }) {
    const user = await this.repository.findUser(params.email);

    if (!user) {
      throw new Error('CREDENTIALS_NOT_FOUND');
    }

    const token = this.codeGenerator.generate(6).toUpperCase();

    user.requestResetPassword(token);

    await this.repository.updateUser(user);

    try {
      await this.mailer.send(
        new EmailMessage({
          to: {
            email: user.email,
            name: user.firstName,
          },
          subject: 'Cambia tu clave',
          content: await this.emailContentParser.parseFromFile(
            'general/new-reset-password-request-email.ejs',
            {
              content: `Hola ${user.firstName}. tu código para cambiar tu clave es: ${user.passwordResetToken}`,
            },
          ),
        }),
      );
    } catch (e) {
      console.log(e);
    }
  }
}
