import TypeOrmRepository from '@shared/infrastructure/persistence/typeorm/typeorm-repository';
import { MallEntity } from '@restaurants/auth/infrastructure/persistance/typeorm/entities/mall-entity';
import NestjsCriteriaConverter from '@shared/infrastructure/nestjs/criteria/nestjs-criteria-converter';
import VendorMallRepository from '../../../../domain/repositories/vendor-mall-repository';

export default class VendorMallInfrastructureCommandRepository
    extends TypeOrmRepository<MallEntity>
    implements VendorMallRepository {
    static readonly bindingKey = 'VendorMallRepository';

    getEntityClass() {
        return MallEntity;
    }

    async find(id: string): Promise<any | null> {
        const repository = this.repository();
        const entity = await repository.findOne({
            where: {
                id: id
            }
        });
        return entity || null;
    }

    async findAll(criteria?: any): Promise<any[]> {
        const final = NestjsCriteriaConverter.convert(criteria);
        const repository = this.repository();
        const entities = await repository.find(final);
        return entities;
    }
}
