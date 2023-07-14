import { inject, injectable } from '@shared/domain/decorators';
import { compare, genSalt, hash } from 'bcryptjs';
import PasswordHasher from '../../domain/utils/password-hasher';

@injectable()
export default class BcryptHasher implements PasswordHasher<string> {
  constructor(
    @inject('utils.hasher.round')
    private readonly rounds: number,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(this.rounds);
    return hash(password, salt);
  }

  async comparePassword(
    providedPass: string,
    storedPass: string,
  ): Promise<boolean> {
    const passwordIsMatched = await compare(providedPass, storedPass);
    return passwordIsMatched;
  }
}
