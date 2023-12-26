import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Stores {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    address: string;

    @Column({ default: null })
    phoneNumber: string | null;

    @Column({ default: null })
    email: string | null;

    @Column({ default: null })
    instagram: string | null;

    @Column()
    weekdays: string;

    @Column()
    saturdays: string;

    @Column()
    sundays: string;

    @Column({ type: 'bigint' })
    addedAt: string;
}