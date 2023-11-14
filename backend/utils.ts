import { createConnection } from "./database"

const opts = '1234567890';
const length = 8;
export const createId: (table: 'veckans_deal' | 'events' | 'images') => Promise<string> = async (table) => {
    const db = await createConnection();

    let id = '';
    for(let i = 0; i < length; i++) {
        id += opts[Math.floor(Math.random() * opts.length)];
    }

    const [data] = await db.execute(`SELECT id FROM \`${table}\` WHERE id = ?`, [id]);
    if((data as any[]).length) return await createId(table);

    return id;
}