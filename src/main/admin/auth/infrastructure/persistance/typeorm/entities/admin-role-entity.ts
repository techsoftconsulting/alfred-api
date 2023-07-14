import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'admin-role',
})
export class AdminRoleEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({
    name: 'permissions',
    type: 'text',
    array: true,
  })
  permissions: string[];

  @Column({ default: false, name: 'is_supper_admin' })
  isSuperAdmin?: boolean;

  @Column({
    default: 'ACTIVE',
  })
  status?: string;

  constructor(props: Partial<AdminRoleEntity>) {
    Object.assign(this, { ...props });
  }
}
