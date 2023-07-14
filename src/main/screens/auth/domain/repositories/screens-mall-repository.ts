export default interface ScreensMallRepository {
  find(id: string): Promise<any | null>;

  findAll(): Promise<any[]>;
}
