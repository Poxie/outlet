import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Stores {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    address: string;

    @Column()
    phoneNumber?: string;

    @Column()
    email?: string;

    @Column()
    weekdays: string;

    @Column()
    saturdays: string;

    @Column()
    sundays: string;

    @Column({ type: 'bigint' })
    addedAt: string;
}