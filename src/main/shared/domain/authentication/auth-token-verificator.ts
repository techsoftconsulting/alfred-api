export default interface AuthTokenVerificator<T> {
  verify(data: any): Promise<T>;
}
