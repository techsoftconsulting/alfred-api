import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'admin',
})
export default class AdminEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  email: string;

  @Column({
    name: 'first_name',
  })
  firstName: string;

  @Column({
    name: 'last_name',
  })
  lastName: string;

  @Column()
  password: string;

  @Column({
    name: 'role_id',
    default: 'SUPER_ADMIN',
  })
  roleId?: string;

  @Column({
    default: 'ACTIVE',
  })
  status?: string;

  @Column({
    nullable: true,
  })
  passwordResetToken?: string;

  constructor(props: Partial<AdminEntity>) {
    Object.assign(this, { ...props });
  }
}
