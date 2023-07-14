export default interface PasswordHasher<T = string> {
  hashPassword(password: T): Promise<T>;
  comparePassword(providedPass: T, storedPass: T): Promise<boolean>;
}
