import AuthenticateAdminCommand from '@admin/auth/application/authenticate/authenticate-admin-command';
import CommandHandler from '@shared/domain/bus/command/command-handler';
import { inject } from '@shared/domain/decorators';
import service from '@shared/domain/decorators/service';
import AuthenticateAdminUseCase from './authenticate-admin-use-case';

@service()
export default class AuthenticateAdminCommandHandler implements CommandHandler {
    constructor(
        @inject('AuthenticateAdminUseCase')
        private authenticator: AuthenticateAdminUseCase
    ) {
    }

    getCommandName(): string {
        return AuthenticateAdminCommand.name;
    }

    async handle(command: AuthenticateAdminCommand): Promise<any> {
        try {
            return await this.authenticator.execute({ ...command });
        } catch (e) {
            throw new Error(e.message);
        }
    }
}
