import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'mall',
})
export class AdminMallEntity {
  @PrimaryColumn({
    name: 'mall_id',
  })
  id: string;

  @Column({
    name: 'mall_name',
    default: '',
  })
  name: string;

  @Column({
    default: '',
  })
  address: string;

  @Column({
    default: 'ACTIVE',
  })
  status: string;

  @Column({
    name: 'logo_url',
    nullable: true,
  })
  logoUrl: string;

  @Column({
    default: true,
  })
  available: boolean;

  constructor(props: Partial<AdminMallEntity>) {
    Object.assign(this, { ...props });
  }
}
