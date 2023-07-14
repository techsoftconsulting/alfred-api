export default interface RestaurantReservationRepository {
  findReservations(filter?: any, pagination?: any, sort?: any): Promise<any[]>;

  getReservation(id: string): Promise<any | undefined>;

  updateReservation(item: any): Promise<any>;

  createReservation(item: any): Promise<any>;

  deleteReservation(id: string): Promise<any>;
}
