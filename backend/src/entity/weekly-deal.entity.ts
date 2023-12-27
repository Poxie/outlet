import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class WeeklyDeal {
    @PrimaryColumn({ type: 'varchar' })
    id: string;

    @Column({ type: 'varchar' })
    date: string;

    @Column({ type: 'bigint' })
    timestamp: string;
}