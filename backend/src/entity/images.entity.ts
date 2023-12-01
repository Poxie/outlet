import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Images {
    @PrimaryColumn()
    id: string;

    @Column()
    image: string;

    @Column()
    parentId: string;

    @Column()
    position: number;

    @Column({ type: 'bigint' })
    timestamp: string;
}