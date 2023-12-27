import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Banners {
    @PrimaryColumn({ type: 'varchar' })
    id: string;

    @Column({ type: 'text' })
    text: string;

    @Column({ type: 'boolean', default: false })
    active: boolean;

    @Column({ type: 'bigint' })
    createdAt: string;
}