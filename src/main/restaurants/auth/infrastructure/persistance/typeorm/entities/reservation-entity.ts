import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'reservation',
})
export class ReservationEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  code: string;

  @Column({
    type: 'jsonb',
  })
  restaurant: any;

  @Column({
    name: 'restaurant_id',
  })
  restaurantId: string;

  @Column({
    name: 'client_id',
    nullable: true,
  })
  clientId?: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  client?: any;

  @Column({
    type: 'jsonb',
  })
  table: any;

  @Column()
  hour: string;

  @Column()
  date: string;

  @Column({
    type: 'timestamp',
  })
  datetime: Date;

  @Column({
    type: 'jsonb',
  })
  mall: any;

  @Column()
  status: string;

  @Column({
    name: 'number_of_people',
  })
  numberOfPeople: number;

  @Column({
    name: 'checked_in',
    type: 'boolean',
    default: false,
  })
  checkedIn?: boolean;

  @Column({
    name: 'cancelled',
    type: 'boolean',
    default: false,
  })
  cancelled?: boolean;

  @Column({
    name: 'checked_in_at',
    type: 'timestamp',
    nullable: true,
  })
  checkedInAt?: Date;

  constructor(props: Partial<ReservationEntity>) {
    Object.assign(this, { ...props });
  }
}
