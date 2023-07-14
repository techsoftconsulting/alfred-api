export default interface ScreensRestaurantProductRepository {
  find(id: string): Promise<any | null>;

  findAll(filters: any): Promise<any[]>;
}
