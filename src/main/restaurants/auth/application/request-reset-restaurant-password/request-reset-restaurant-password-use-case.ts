import EventBus from '@shared/domain/bus/event/event-bus';
import { inject } from '@shared/domain/decorators';
import service from '@shared/domain/decorators/service';
import SimpleCodeGenerator from '@shared/infrastructure/utils/simple-code-generator';
import RestaurantAccountsRepository from '@restaurants/auth/domain/repositories/restaurant-accounts-repository';
import EmailSender from '@shared/domain/email/email-sender';
import EmailContentParser from '@shared/domain/email/email-content-parser';
import EmailMessage from '@shared/domain/email/email-message';

@service()
export default class RequestResetRestaurantPasswordUseCase {
  constructor(
    @inject('RestaurantAccountsRepository')
    private repository: RestaurantAccountsRepository,
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
    const user = await this.repository.findByEmail(params.email);

    if (!user) {
      throw new Error('CREDENTIALS_NOT_FOUND');
    }

    const token = this.codeGenerator.generate(6).toUpperCase();

    await this.repository.saveAccount({
      ...user,
      passwordResetToken: token,
    });

    try {
      await this.mailer.send(
        new EmailMessage({
          to: {
            email: user.email,
            name: user.fullName,
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
