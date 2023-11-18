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
}