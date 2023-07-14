import ValueObject from '@shared/domain/value-object/value-object';

export interface AdminAuthCredentialsProps {
  email: string;
  password?: string;
  plainPassword?: string;
}

export default class AdminAuthCredentials extends ValueObject<AdminAuthCredentialsProps> {
  public get email() {
    return this.props.email;
  }

  public get password() {
    return this.props.password;
  }

  public get plainPassword() {
    return this.props.plainPassword;
  }

  constructor(properties: AdminAuthCredentialsProps) {
    super(properties);
  }

  static fromPrimitives(plainData: AdminAuthCredentialsProps) {
    return new AdminAuthCredentials(plainData);
  }
}
