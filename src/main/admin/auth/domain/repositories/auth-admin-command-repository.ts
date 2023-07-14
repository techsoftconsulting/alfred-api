import AdminAuthUser from '../models/admin-auth-user';

export default interface AuthAdminCommandRepository {
  findUser(email: string): Promise<AdminAuthUser | null>;

  findUserById(userId: string): Promise<AdminAuthUser | null>;

  register(user: AdminAuthUser): Promise<void>;

  updateUser(user: AdminAuthUser): Promise<void>;

  changePassword(user: AdminAuthUser): Promise<void>;
}
