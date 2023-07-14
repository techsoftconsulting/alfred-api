export default interface VendorRepository {
  getProfileBySlug(slug: string): Promise<any | undefined>;

  getProfileById(id: string): Promise<any | undefined>;

  update(item: any): Promise<any>;

  findCategories(): Promise<any[]>;

}
