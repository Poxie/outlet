import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Inspiration {
    @PrimaryColumn({ type: 'varchar' })
    id: string;

    @Column({ type: 'varchar' })
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'boolean', default: false })
    archived: boolean;

    @Column({ type: 'bigint' })
    timestamp: string;
}