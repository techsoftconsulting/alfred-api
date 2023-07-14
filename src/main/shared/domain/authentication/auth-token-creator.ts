export default interface AuthTokenCreator<T> {
  generate(data: { [props: string]: any; userType: string }): Promise<string>;
}
