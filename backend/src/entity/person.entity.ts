import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Person {
    @PrimaryColumn({ type: 'varchar' })
    id: string;

    @Column({ type: "varchar" })
    username: string;

    @Column({ type: "varchar" })
    password: string;
}