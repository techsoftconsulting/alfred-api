import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'restaurant-table-schedule',
})
export class RestaurantTableScheduleEntity {
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
    name: 'schedule',
    type: 'jsonb',
  })
  schedule: any;

  constructor(props: Partial<RestaurantTableScheduleEntity>) {
    Object.assign(this, { ...props });
  }
}
