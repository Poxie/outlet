import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Store {
    @PrimaryColumn({ type: 'varchar' })
    id: string;

    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'varchar' })
    address: string;

    @Column({ type: 'varchar', default: null, nullable: true })
    phoneNumber: string | null;

    @Column({ type: 'varchar', default: null, nullable: true })
    email: string | null;

    @Column({ type: 'varchar', default: null, nullable: true })
    instagram: string | null;

    @Column({ type: 'varchar' })
    weekdays: string;

    @Column({ type: 'varchar' })
    saturdays: string;

    @Column({ type: 'varchar' })
    sundays: string;

    @Column({ type: 'bigint' })
    addedAt: string;
}