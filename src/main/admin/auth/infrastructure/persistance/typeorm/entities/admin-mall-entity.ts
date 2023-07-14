import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'mall',
})
export class AdminMallEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  status: string;

  @Column({
    name: 'logo_url',
  })
  logoUrl: string;

  @Column()
  available: boolean;

  constructor(props: Partial<AdminMallEntity>) {
    Object.assign(this, { ...props });
  }
}
