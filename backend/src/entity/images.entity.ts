import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Images {
    @PrimaryColumn()
    id: string;

    @Column()
    parentId: string;

    @Column({ type: 'bigint' })
    timestamp: string;
}