import { Column, Entity, PrimaryColumn } from "typeorm";
import { ImageType } from "../utils/constants";

@Entity()
export class Images {
    @PrimaryColumn()
    id: string;
    
    @Column()
    image: string;
    
    @Column()
    parentId: string;

    @Column()
    type: ImageType;

    @Column()
    position: number;

    @Column({ type: 'bigint' })
    timestamp: string;
}