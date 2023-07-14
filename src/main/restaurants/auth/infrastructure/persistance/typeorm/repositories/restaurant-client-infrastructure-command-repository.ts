import TypeOrmRepository from '@shared/infrastructure/persistence/typeorm/typeorm-repository';
import { RestaurantClientEntity } from '@restaurants/auth/infrastructure/persistance/typeorm/entities/restaurant-client-entity';
import RestaurantClientRepository from '@restaurants/auth/domain/repositories/restaurant-client-repository';
import NestjsCriteriaConverter from '@shared/infrastructure/nestjs/criteria/nestjs-criteria-converter';

export default class RestaurantClientInfrastructureCommandRepository
  extends TypeOrmRepository<RestaurantClientEntity>
  implements RestaurantClientRepository
{
  static readonly bindingKey = 'RestaurantClientRepository';

  getEntityClass() {
    return RestaurantClientEntity;
  }

  async findClients(
    filter?: any,
    pagination?: any,
    sort?: any,
  ): Promise<any[]> {
    const final = NestjsCriteriaConverter.convert(filter);
    const repository = this.repository();
    const clients = await repository.find(final);
    return clients;
  }

  async getClient(id: string): Promise<any | undefined> {
    const repository = this.repository();
    const client = await repository.findOne({
      where: {
        id: id,
      },
    });
    return client;
  }

  async updateClient(client: any): Promise<any> {
    const repository = this.repository();
    const updatedClient = await repository.save(client);
    return updatedClient;
  }

  async createClient(item: any): Promise<any> {
    const repository = this.repository();
    const createdClient = await repository.save(item);
    return createdClient;
  }

  async deleteClient(id: string): Promise<any> {
    const repository = this.repository();
    const client = await repository.findOne({
      where: {
        id: id,
      },
    });

    if (!client) {
      throw new Error('Client not found');
    }

    await repository.save({
      ...client,
      status: 'DELETED',
    });
    return client;
  }
}
