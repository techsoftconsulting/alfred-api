import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'screen_events',
})
export class ScreenEventsEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  event: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  data?: any;

  @Column({
    name: 'occurred_on',
    type: 'timestamp',
  })
  occurredOn: Date;

  constructor(props: Partial<ScreenEventsEntity>) {
    Object.assign(this, { ...props });
  }
}
