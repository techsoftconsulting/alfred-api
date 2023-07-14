export default interface VendorPromotionRepository {
  save(item: any): Promise<void>;

  delete(id: string): Promise<void>;

  find(id: string): Promise<any | null>;

  findAll(filters: any): Promise<any[]>;
}
