const jwt = require('jsonwebtoken');
import { UnauthorizedException } from '@nestjs/common';
import { promisify } from 'util';

const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

interface Profile {
  id: string;
  firstName: string;
  [props: string]: any;
}

export class JWTBaseCreator {
  constructor(
    private readonly jwtSecret: string,
    private readonly jwtExpiresIn: string,
  ) {}

  public async generateToken(userProfile: Profile): Promise<string> {
    if (!userProfile) {
      throw new UnauthorizedException('INVALID_USER');
    }

    // Generate a JSON Web Token
    let token: string;
    try {
      token = await signAsync(userProfile, this.jwtSecret, {
        expiresIn: this.jwtExpiresIn,
      });
    } catch (error) {
      throw new UnauthorizedException(`Error encoding token : ${error}`);
    }

    return token;
  }
}
