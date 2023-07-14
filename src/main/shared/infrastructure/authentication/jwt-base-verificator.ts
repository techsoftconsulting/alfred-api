const jwt = require('jsonwebtoken');
import { UnauthorizedException } from '@nestjs/common';
import { promisify } from 'util';

const verifyAsync = promisify(jwt.verify);

interface Profile {
  id: string;
  firstName: string;
  [props: string]: any;
}

export class JWTBaseVerificator {
  constructor(private readonly jwtSecret: string) {}

  public async verifyToken(token: string): Promise<Profile> {
    if (!token) {
      throw new UnauthorizedException('INVALID_USER');
    }

    let userProfile: Profile;

    try {
      // decode user profile from token
      const decodedToken = await verifyAsync(token, this.jwtSecret);
      // don't copy over  token field 'iat' and 'exp', nor 'email' to user profile
      const securityId = 'token';
      userProfile = Object.assign({
        lastName: decodedToken.lastName,
        firstName: decodedToken.firstName,
        email: decodedToken.email,
        id: decodedToken.id,
        roles: decodedToken.roles,
        ...decodedToken,
      });
    } catch (error) {
      throw new UnauthorizedException('INVALID_USER');
    }
    return userProfile;
  }
}
