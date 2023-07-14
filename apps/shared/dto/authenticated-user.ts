interface AuthenticatedUserProps {
  id: string;
  email: string;
  profilePictureUrl?: string;
  metadata?: any;
}

export interface AuthenticatedUserPrimitiveProps {
  id: string;
  email: string;
  profilePictureUrl?: string;
  metadata?: any;
}

export default class AuthenticatedUser {
  constructor(private props: AuthenticatedUserProps) {}

  get id() {
    return this.props.id;
  }

  get email() {
    return this.props.email;
  }

  get metadata() {
    return this.props.metadata;
  }

  get profilePictureUrl() {
    return this.props.profilePictureUrl;
  }

  static fromPrimitives(
    props: AuthenticatedUserPrimitiveProps,
  ): AuthenticatedUser {
    return new AuthenticatedUser(props);
  }

  toPrimitives() {
    return this.props;
  }
}
