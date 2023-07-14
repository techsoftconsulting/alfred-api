import { UnauthorizedException } from '@nestjs/common';
import firebase from 'firebase-admin';

interface ProfileProps {
  id: string;
}

export default class FirebaseJWTCreator {
  constructor(
    private readonly jwtSecret: string,
    private readonly jwtExpiresIn: string,
  ) {}

  public async verifyToken(token: string): Promise<ProfileProps> {
    if (!token) {
      throw new UnauthorizedException(
        `Error verifying token : 'token' is null`,
      );
    }
    try {
      const decodedToken = await firebase.auth().verifyIdToken(token);
      return {
        id: decodedToken.uid,
      };
    } catch (e) {
      throw new UnauthorizedException(`Invalid firebase token`);
    }
  }

  public async generateToken(data: any): Promise<string> {
    return '';
    /*    if (!userProfile) {
            throw new HttpErrors.Unauthorized(
                'Error generating token : userProfile is null',
            );
        }
        const userInfoForToken = {
            id: userProfile.id,
            firstName: userProfile.firstName,
            lastName: userProfile.lastName,
            email: userProfile.email,
            roles: userProfile.roles,
        };

        // Generate a JSON Web Token
        let token: string;
        try {
            token = await signAsync(userInfoForToken, this.jwtSecret, {
                expiresIn: Number(this.jwtExpiresIn),
            });
        } catch (error) {
            throw new HttpErrors.Unauthorized(
                `Error encoding token : ${error}`,
            );
        }

        return token; */
  }
}
