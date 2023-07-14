export default interface ScreensRestaurantRepository {
  find(id: string): Promise<any | null>;

  findAll(filters?: any): Promise<any[]>;

  getAvailability(id: string): Promise<any>;
}
