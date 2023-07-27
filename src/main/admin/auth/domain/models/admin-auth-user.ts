import AggregateRoot from '@shared/domain/aggregate/aggregate-root';
import Id from '@shared/domain/id/id';
import AdminAuthCredentials, {
  AdminAuthCredentialsProps,
} from './admin-auth-credentials';

export interface AdminAuthUserProps {
  id: Id;
  email: string;
  firstName?: string;
  lastName?: string;
  credentials: AdminAuthCredentialsProps;
  passwordResetToken?: string;
  role: any;
}

export interface AdminAuthUserPrimitiveProps {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  password: string;
  plainPassword?: string;
  passwordResetToken?: string;
  role: any;
}

export default class AdminAuthUser extends AggregateRoot<AdminAuthUserProps> {
  get id() {
    return this.props.id;
  }

  get email() {
    return this.props.email;
  }

  get passwordResetToken() {
    return this.props.passwordResetToken;
  }

  get role() {
    return this.props.role;
  }

  get firstName() {
    return this.props.firstName;
  }

  get lastName() {
    return this.props.lastName;
  }

  get plainPassword(): string | undefined {
    return this.props.credentials.plainPassword;
  }

  get password(): string | undefined {
    return this.props.credentials.password;
  }

  static create(props: AdminAuthUserProps) {
    const newUser = new AdminAuthUser(props);
    return newUser;
  }

  static fromPrimitives(plainData: AdminAuthUserPrimitiveProps): AdminAuthUser {
    const credentials = AdminAuthCredentials.fromPrimitives({
      email: plainData.email,
      password: plainData.password,
      plainPassword: plainData.plainPassword,
    });

    return new AdminAuthUser({
      id: new Id(plainData.id),
      email: plainData.email,
      firstName: plainData.firstName,
      lastName: plainData.lastName,
      credentials: credentials,
      role: plainData.role,
      passwordResetToken: plainData.passwordResetToken,
    });
  }

  requestResetPassword(code) {
    this.props.passwordResetToken = code;

    return this;
  }

  overridePassword(newPassword) {
    this.props.passwordResetToken = null;
    this.changePassword(newPassword);
  }

  verifyResetPasswordToken(token: string) {
    return this.props.passwordResetToken === token;
  }

  public changePassword(newPassword: string) {
    this.props.credentials = AdminAuthCredentials.fromPrimitives({
      ...this.props.credentials,
      password: newPassword,
    });
  }

  toPrimitives(): AdminAuthUserPrimitiveProps {
    const json: any = super.toJson();
    return json;
  }
}
