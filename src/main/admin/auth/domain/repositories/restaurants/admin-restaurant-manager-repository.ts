export default interface AdminRestaurantManagerRepository {
  save(manager: any): Promise<void>;

  delete(id: string): Promise<void>;

  find(id: string): Promise<any | null>;

  findByEmail(email: string): Promise<any | null>;

  findAll(criteria: any): Promise<any[]>;
}
