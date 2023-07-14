import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'store',
})
export class StoreEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'text',
    array: true,
    name: 'categories_ids',
  })
  categoriesIds: string[];

  @Column()
  description: string;

  @Column({
    name: 'logo_url',
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
