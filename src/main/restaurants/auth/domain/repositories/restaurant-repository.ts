export default interface RestaurantRepository {
  getProfileBySlug(slug: string): Promise<any | undefined>;

  getProfileById(id: string): Promise<any | undefined>;

  findCategories(): Promise<any[]>;

  updateRestaurant(restaurant: any): Promise<any>;

  getNearAvailability(id: string): Promise<any>;

  getDayAvailability(id: string, date: string): Promise<any>;
}
