export default interface RestaurantAreaRepository {
  findAreas(filter?: any, pagination?: any, sort?: any): Promise<any[]>;

  updateArea(item: any): Promise<any>;

  createArea(item: any): Promise<any>;

  deleteArea(id: string): Promise<any>;
}
