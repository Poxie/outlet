import { Event, Image } from "../../types";
import { createConnection } from "../database"

export const getEvent = async (eventId: string) => {
    const db = await createConnection();
    
    const [data] = await db.execute(`SELECT * FROM events WHERE id = ?`, [eventId]);
    if(!Array.isArray(data)) return;

    return data[0] as Event | undefined;
}
export const getImage = async (imageId: string) => {
    const db = await createConnection();
    
    const [data] = await db.execute(`SELECT * FROM images WHERE id = ?`, [imageId]);
    if(!Array.isArray(data)) return;

    return data[0] as Image | undefined;
}