export default interface AdminRestaurantRepository {
  save(restaurant: any): Promise<void>;

  delete(id: string): Promise<void>;

  find(id: string): Promise<any | null>;

  guardUniqueSlug(slug: string, id: string): Promise<any>;

  findAll(filters?: any): Promise<any[]>;
}
