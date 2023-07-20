import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import Id from '@shared/domain/id/id';

@Entity({
  name: 'store',
})
export class StoreEntity {
  @PrimaryGeneratedColumn({
    name: 'store_id',
  })
  uuid: string;

  @PrimaryColumn({
    default: new Id().value,
  })
  id: string;

  @Column({
    name: 'store_name',
    default: '',
  })
  name: string;

  @Column({
    name: 'phrase',
    default: '',
  })
  description: string;

  @Column({
    type: 'text',
    array: true,
    name: 'categories_ids',
  })
  categoriesIds: string[];

  @Column({
    name: 'logo_url',
    nullable: true,
  })
  logoUrl?: string;

  @Column({
    name: 'cover_image_url',
  })
  coverImageUrl?: string;

  @Column()
  slug: string;

  @Column({
    type: 'jsonb',
  })
  schedule: any;

  @Column()
  address: string;

  @Column({
    name: 'contact_phone',
  })
  contactPhone: string;

  @Column()
  status: string;

  @Column({
    type: 'timestamp',
    name: 'created_at',
  })
  createdAt: Date;

  @Column({
    type: 'boolean',
    default: false,
  })
  recommended: boolean;

  @Column({
    type: 'boolean',
    default: true,
  })
  available: boolean;

  @Column({
    default: 'RESTAURANT',
  })
  type: string;

  constructor(props: Partial<StoreEntity>) {
    Object.assign(this, { ...props });
  }
}
