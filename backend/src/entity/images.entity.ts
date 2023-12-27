import { Column, Entity, PrimaryColumn } from "typeorm";
import { ImageType } from "../utils/constants";

@Entity()
export class Images {
    @PrimaryColumn({ type: 'varchar' })
    id: string;
    
    @Column({ type: 'varchar' })
    image: string;
    
    @Column({ type: 'varchar' })
    parentId: string;

    @Column({ type: 'varchar' })
    type: ImageType;

    @Column({ type: 'bigint' })
    position: number;

    @Column({ type: 'bigint' })
    timestamp: string;
}