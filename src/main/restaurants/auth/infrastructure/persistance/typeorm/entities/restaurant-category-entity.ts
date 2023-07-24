import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'category',
})
export class RestaurantCategoryEntity {
  @PrimaryColumn({
    name: 'category_id',
  })
  id: string;

  @Column({
    name: 'category_name',
    default: '',
  })
  name: string;

  @Column({
    default: 'RESTAURANT',
  })
  type: string;

  @Column({
    default: 'ACTIVE',
  })
  status: string;

  constructor(props: Partial<RestaurantCategoryEntity>) {
    Object.assign(this, { ...props });
  }
}
