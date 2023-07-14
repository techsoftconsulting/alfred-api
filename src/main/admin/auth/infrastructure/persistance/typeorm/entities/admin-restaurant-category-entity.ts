import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'category',
})
export class AdminRestaurantCategoryEntity {
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

  constructor(props: Partial<AdminRestaurantCategoryEntity>) {
    Object.assign(this, { ...props });
  }
}
