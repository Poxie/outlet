import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class People {
    @PrimaryColumn()
    id: string;

    @Column()
    username: string;

    @Column()
    password: string;
}