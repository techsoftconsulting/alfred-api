import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import Id from '@shared/domain/id/id';

@Entity({
  name: 'category',
})
export class AdminRestaurantCategoryEntity {
  @PrimaryGeneratedColumn({
    name: 'category_id',
  })
  uuid: string;

  @PrimaryColumn({
    default: new Id().value,
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

  @Column()
  status: string;

  constructor(props: Partial<AdminRestaurantCategoryEntity>) {
    Object.assign(this, { ...props });
  }
}
