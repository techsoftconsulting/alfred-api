export default interface ScreensRestaurantAreaRepository {
    findAreas(filter?: any, pagination?: any, sort?: any): Promise<any[]>;
}
