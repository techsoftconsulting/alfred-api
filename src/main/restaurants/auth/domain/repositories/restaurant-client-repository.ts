export default interface RestaurantClientRepository {
  findClients(filter?: any, pagination?: any, sort?: any): Promise<any[]>;

  getClient(id: string): Promise<any | undefined>;

  updateClient(client: any): Promise<any>;

  createClient(item: any): Promise<any>;

  deleteClient(id: string): Promise<any>;
}
