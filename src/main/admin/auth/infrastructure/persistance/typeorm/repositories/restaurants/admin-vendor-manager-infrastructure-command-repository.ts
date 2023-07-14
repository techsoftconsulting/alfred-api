import TypeOrmRepository from '@shared/infrastructure/persistence/typeorm/typeorm-repository';
import NestjsCriteriaConverter from '@shared/infrastructure/nestjs/criteria/nestjs-criteria-converter';
import { In } from 'typeorm';
import AdminVendorManagerRepository from '@admin/auth/domain/repositories/restaurants/admin-vendor-manager-repository';
import { AdminVendorManagerEntity } from '@admin/auth/infrastructure/persistance/typeorm/entities/admin-vendor-manager-entity';

export default class AdminVendorManagerInfrastructureCommandRepository
    extends TypeOrmRepository<AdminVendorManagerEntity>
    implements AdminVendorManagerRepository {
    static readonly bindingKey = 'AdminVendorManagerRepository';

    getEntityClass(): any {
        return AdminVendorManagerEntity;
    }

    async save(manager: any): Promise<void> {
        const repository = this.repository();
        await repository.save(manager);
    }

    async saveMany(managers: any[]): Promise<void> {
        const repository = this.repository();
        await repository.save(managers);
    }

    async delete(id: string): Promise<void> {
        const repository = this.repository();
        const manager = await repository.findOne({
            where: {
                id: id
            }
        });
        if (manager) {
            await repository.save({
                ...manager,
                status: 'DELETED'
            });
        }
    }

    async find(id: string): Promise<any | null> {
        const repository = this.repository();
        const manager = await repository.findOne({
            where: {
                id: id
            }
        });
        return manager || null;
    }

    async findByEmail(email: string): Promise<any | null> {
        const repository = this.repository();
        const manager = await repository.findOne({
            where: {
                email: email,
                status: 'ACTIVE',
                roles: In(['USER'])
            }
        });
        return manager || null;
    }

    async findAll(filters?: any): Promise<any[]> {
        const final = NestjsCriteriaConverter.convert(filters);
        const repository = this.repository();
        const managers = await repository.find(final);
        return managers;
    }
}
