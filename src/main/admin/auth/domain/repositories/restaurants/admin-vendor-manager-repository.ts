export default interface AdminVendorManagerRepository {
    save(manager: any): Promise<void>;

    saveMany(managers: any[]): Promise<void>;

    delete(id: string): Promise<void>;

    find(id: string): Promise<any | null>;

    findByEmail(email: string): Promise<any | null>;

    findAll(restaurantId: string): Promise<any[]>;
}
