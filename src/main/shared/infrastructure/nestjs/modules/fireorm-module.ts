import { Module } from '@nestjs/common';
import FireOrmService from '../fireorm/fireorm-service';

@Module({
  imports: [],
  providers: [FireOrmService],
})
export class FireOrmModule {
  constructor() {}
}
