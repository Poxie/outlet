import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class WeeklyDeal {
    @PrimaryColumn()
    id: string;

    @Column()
    date: string;

    @Column({ type: 'bigint' })
    timestamp: string;
}