import TypeOrmRepository from '@shared/infrastructure/persistence/typeorm/typeorm-repository';
import ScreensRestaurantRepository from '@screens/auth/domain/repositories/screens-restaurant-repository';
import NestjsCriteriaConverter from '@shared/infrastructure/nestjs/criteria/nestjs-criteria-converter';
import { StoreEntity } from '@restaurants/auth/infrastructure/persistance/typeorm/entities/store-entity';

export default class ScreensRestaurantInfrastructureCommandRepository
    extends TypeOrmRepository<StoreEntity>
    implements ScreensRestaurantRepository {
    static readonly bindingKey = 'ScreensRestaurantRepository';

    getEntityClass(): any {
        return StoreEntity;
    }

    async find(id: string): Promise<any | null> {
        const repository = this.repository();
        const restaurant = await repository.findOne({
            where: {
                id: id,
                status: 'ACTIVE'
            }
        });
        return restaurant || null;
    }

    async findAll(filters?: any): Promise<any[]> {
        const final = NestjsCriteriaConverter.convert(filters);
        const repository = this.repository();
        const restaurants = await repository.find(final);
        return restaurants;
    }

    async getAvailability(id: string): Promise<any> {
        // Implement the logic to retrieve availability for the given restaurant ID
        // Return the availability data
    }
}
