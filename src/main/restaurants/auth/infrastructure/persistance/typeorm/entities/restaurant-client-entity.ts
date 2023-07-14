import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'restaurant-client',
})
export class RestaurantClientEntity {
  @PrimaryColumn()
  id: string;

  @Column({
    name: 'first_name',
  })
  firstName: string;

  @Column({
    name: 'last_name',
  })
  lastName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({
    nullable: true,
  })
  allergies?: string;

  @Column()
  status: string;

  @Column({
    name: 'image_url',
    nullable: true,
  })
  imageUrl?: string;

  @Column({
    name: 'restaurant_id',
  })
  restaurantId: string;

  @Column({
    name: 'favorite_table',
    type: 'jsonb',
    nullable: true,
  })
  favoriteTable?: any;

  constructor(props: Partial<RestaurantClientEntity>) {
    Object.assign(this, { ...props });
  }
}
