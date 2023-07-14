export default interface RestaurantMallRepository {
  find(id: string): Promise<any | null>;

  findAll(): Promise<any[]>;
}
