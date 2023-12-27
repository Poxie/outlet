import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Category {
    @PrimaryColumn({ type: 'varchar' })
    id: string;

    @Column({ type: 'bigint' })
    timestamp: string;

    @Column({ type: 'varchar' })
    name: string;
    
    @Column({ type: 'text', default: null, nullable: true })
    description: string | null;

    @Column({ type: 'boolean', default: false })
    archived: boolean;
}