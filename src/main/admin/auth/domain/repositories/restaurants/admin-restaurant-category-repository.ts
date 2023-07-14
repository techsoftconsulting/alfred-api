export default interface AdminRestaurantCategoryRepository {
  save(category: any): Promise<void>;

  delete(id: string): Promise<void>;

  find(id: string): Promise<any | null>;

  findAll(): Promise<any[]>;
}
