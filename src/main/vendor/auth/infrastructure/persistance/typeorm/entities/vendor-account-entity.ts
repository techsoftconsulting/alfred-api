import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'vendor-user',
})
export class VendorAccountEntity {
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

  @Column({
    name: 'vendor_id',
  })
  vendorId: string;

  @Column({
    type: 'text',
    array: true,
  })
  roles: string[];

  @Column()
  status: string;

  @Column()
  type: string;

  @Column()
  password: string;

  @Column({
    default: false,
    name: 'custom_password',
  })
  customPasswordConfigured: boolean;

  @Column({
    nullable: true,
  })
  passwordResetToken?: string;

  @Column({
    default: false,
    name: 'principal',
  })
  principal: boolean;

  constructor(props: Partial<VendorAccountEntity>) {
    Object.assign(this, { ...props });
  }
}
