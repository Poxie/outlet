import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Events {
    @PrimaryColumn({ type: 'varchar' })
    id: string;

    @Column({ type: 'bigint' })
    timestamp: string;

    @Column({ type: 'varchar' })
    title: string;
    
    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'varchar' })
    image: string;

    @Column({ type: 'boolean', default: false })
    archived: boolean;

    @Column({ type: 'varchar', default: null, nullable: true })
    parentId: string | null;
}