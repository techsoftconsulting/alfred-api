export default interface ScreensRestaurantCategoryRepository {
  find(id: string): Promise<any | null>;

  findAll(): Promise<any[]>;
}
