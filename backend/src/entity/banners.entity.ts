import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Banners {
    @PrimaryColumn()
    id: string;

    @Column()
    text: string;

    @Column({ default: false })
    active: boolean;

    @Column({ type: 'bigint' })
    createdAt: string;
}