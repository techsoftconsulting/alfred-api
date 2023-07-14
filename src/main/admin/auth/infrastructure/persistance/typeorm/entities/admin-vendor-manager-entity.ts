import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'vendor-user',
})
export class AdminVendorManagerEntity {
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

  constructor(props: Partial<AdminVendorManagerEntity>) {
    Object.assign(this, { ...props });
  }
}
