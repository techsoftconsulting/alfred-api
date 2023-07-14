export default interface AdminMallRepository {
  save(item: any): Promise<void>;

  delete(id: string): Promise<void>;

  find(id: string): Promise<any | null>;

  findAll(): Promise<any[]>;
}
