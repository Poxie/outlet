import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Inspiration {
    @PrimaryColumn()
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({ default: false })
    archived: boolean;

    @Column({ type: 'bigint' })
    timestamp: string;
}