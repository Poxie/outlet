import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class People {
    @PrimaryColumn({ type: 'varchar' })
    id: string;

    @Column({ type: "varchar" })
    username: string;

    @Column({ type: "varchar" })
    password: string;
}