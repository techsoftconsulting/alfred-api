export default interface VendorMallRepository {
    find(id: string): Promise<any | null>;

    findAll(): Promise<any[]>;
}
