import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'customer-user',
})
export class CustomerAccountEntity {
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
  status: string;

  @Column()
  password: string;

  constructor(props: Partial<CustomerAccountEntity>) {
    Object.assign(this, { ...props });
  }
}
