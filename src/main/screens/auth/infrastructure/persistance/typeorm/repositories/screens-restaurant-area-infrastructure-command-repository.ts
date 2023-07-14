import TypeOrmRepository from '@shared/infrastructure/persistence/typeorm/typeorm-repository';
import { RestaurantAreaEntity } from '@restaurants/auth/infrastructure/persistance/typeorm/entities/restaurant-area-entity';
import NestjsCriteriaConverter from '@shared/infrastructure/nestjs/criteria/nestjs-criteria-converter';
import ScreensRestaurantAreaRepository from '@screens/auth/domain/repositories/screens-restaurant-area-repository';

export default class ScreensRestaurantAreaInfrastructureCommandRepository
    extends TypeOrmRepository<RestaurantAreaEntity>
    implements ScreensRestaurantAreaRepository {
    static readonly bindingKey = 'ScreensRestaurantAreaRepository';

    getEntityClass() {
        return RestaurantAreaEntity;
    }

    async findAreas(filter?: any, pagination?: any, sort?: any): Promise<any[]> {
        const final = NestjsCriteriaConverter.convert(filter);
        const repository = this.repository();
        const areas = await repository.find(final);
        return areas;
    }

}
