import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Events {
    @PrimaryColumn()
    id: string;

    @Column({ type: 'bigint' })
    timestamp: string;

    @Column()
    title: string;
    
    @Column()
    description: string;

    @Column()
    image: string;

    @Column({ default: false })
    archived: boolean;

    @Column({ default: null })
    parentId: string | null;
}