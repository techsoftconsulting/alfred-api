export default interface ScreensPromotionRepository {
  find(id: string): Promise<any | null>;

  findAll(filters: any): Promise<any[]>;
}
