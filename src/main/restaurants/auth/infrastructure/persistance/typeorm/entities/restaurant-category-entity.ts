import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'category',
})
export class RestaurantCategoryEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({
    default: 'RESTAURANT',
  })
  type: string;

  @Column()
  status: string;

  constructor(props: Partial<RestaurantCategoryEntity>) {
    Object.assign(this, { ...props });
  }
}
