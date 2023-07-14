import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'restaurant-product',
})
export class RestaurantProductEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({
    nullable: true,
  })
  description?: string;

  @Column({
    name: 'image_url',
  })
  imageUrl?: string;

  @Column()
  unity: string;

  @Column({
    type: 'jsonb',
  })
  category: {
    id: string;
    name: string;
  };

  @Column({
    type: 'float',
  })
  price: number;

  @Column()
  available: boolean;

  @Column({
    name: 'restaurant_id',
  })
  restaurantId: string;

  @Column()
  status: string;

  @Column({
    type: 'timestamp',
    name: 'created_at',
  })
  createdAt?: Date;

  constructor(props: Partial<RestaurantProductEntity>) {
    Object.assign(this, { ...props });
  }
}
