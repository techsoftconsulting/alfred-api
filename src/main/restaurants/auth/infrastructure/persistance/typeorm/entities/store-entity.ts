import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'store',
})
export class StoreEntity {
  @PrimaryColumn({
    name: 'store_id',
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
    default: [],
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
    nullable: true,
  })
  coverImageUrl?: string;

  @Column({
    nullable: true,
  })
  slug: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  schedule: any;

  @Column({
    nullable: true,
  })
  address: string;

  @Column({
    name: 'contact_phone',
    nullable: true,
  })
  contactPhone: string;

  @Column({
    default: 'ACTIVE',
  })
  status: string;

  @Column({
    type: 'timestamp',
    name: 'created_at',
    default: new Date(),
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
