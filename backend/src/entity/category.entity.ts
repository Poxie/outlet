import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Category {
    @PrimaryColumn()
    id: string;

    @Column({ type: 'bigint' })
    timestamp: string;

    @Column()
    name: string;
    
    @Column({ default: null })
    description: string | null;

    @Column({ default: false })
    archived: boolean;
}