import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'restaurant-area',
})
export class RestaurantAreaEntity {
  @PrimaryColumn()
  id: string;

  @Column({
    name: 'name',
  })
  name: string;

  @Column({
    name: 'restaurant_id',
  })
  restaurantId: string;

  @Column({
    name: 'tables',
    type: 'jsonb',
  })
  tables: any;

  constructor(props: Partial<RestaurantAreaEntity>) {
    Object.assign(this, { ...props });
  }
}
