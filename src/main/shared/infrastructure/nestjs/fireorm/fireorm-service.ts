import { Injectable } from '@nestjs/common';
import { inject } from '@shared/domain/decorators';
import {
  FirebaseAdminSDK,
  FIREBASE_ADMIN_INJECT,
} from '@tfarras/nestjs-firebase-admin';
import * as fireorm from 'fireorm';

@Injectable()
export default class FireOrmService {
  constructor(
    @inject(FIREBASE_ADMIN_INJECT) private firebase: FirebaseAdminSDK,
  ) {
    fireorm.initialize(firebase.firestore());
  }
}
