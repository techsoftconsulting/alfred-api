import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
    name: 'promotion'
})
export class RestaurantPromotionEntity {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    type: string;

    @Column()
    available: boolean;

    @Column({
        name: 'image_url'
    })
    imageUrl: string;

    @Column({
        type: 'text',
        name: 'malls_ids',
        array: true
    })
    mallsIds: string[];

    @Column()
    status: string;

    @Column()
    description: string;

    @Column('jsonb')
    duration: any;

    @Column({
        type: 'timestamp',
        name: 'created_at',
        nullable: true
    })
    createdAt?: Date;

    @Column({
        type: 'timestamp',
        name: 'duration_start'
    })
    durationStart: Date;

    @Column({
        type: 'timestamp',
        name: 'duration_end'
    })
    durationEnd: Date;

    @Column({
        name: 'store_id'
    })
    storeId: string;

    constructor(props: Partial<RestaurantPromotionEntity>) {
        Object.assign(this, { ...props });
    }
}
