export default interface ScreensRestaurantPromotionRepository {
  find(id: string): Promise<any | null>;

  findAll(filters: any): Promise<any[]>;
}
