export default interface RestaurantTableScheduleRepository {
  findSchedules(filter?: any, pagination?: any, sort?: any): Promise<any[]>;

  updateSchedule(item: any): Promise<any>;

  createSchedule(item: any): Promise<any>;

  deleteSchedule(id: string): Promise<any>;
}
