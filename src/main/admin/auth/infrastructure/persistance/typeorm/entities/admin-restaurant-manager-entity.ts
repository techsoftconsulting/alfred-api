import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'restaurant-user',
})
export class AdminRestaurantManagerEntity {
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
    name: 'restaurant_id',
  })
  restaurantId: string;

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
    default: false,
    name: 'principal',
  })
  principal: boolean;

  constructor(props: Partial<AdminRestaurantManagerEntity>) {
    Object.assign(this, { ...props });
  }
}
