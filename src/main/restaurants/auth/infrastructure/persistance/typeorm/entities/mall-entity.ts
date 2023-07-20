import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import Id from '@shared/domain/id/id';

@Entity({
  name: 'mall',
})
export class MallEntity {
  @PrimaryGeneratedColumn({
    name: 'mall_id',
  })
  uuid: string;

  @PrimaryColumn({
    default: new Id().value,
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

  @Column()
  status: string;

  @Column({
    name: 'logo_url',
  })
  logoUrl: string;

  @Column()
  available: boolean;

  constructor(props: Partial<MallEntity>) {
    Object.assign(this, { ...props });
  }
}
