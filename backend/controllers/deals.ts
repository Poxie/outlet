import { WeeklyDeal } from "../../types";
import { createConnection } from "../database"

export const getWeeklyDeal = async (dealId: string) => {
    const db = await createConnection();

    const [data] = await db.execute('SELECT * FROM veckans_deal WHERE id = ?', [dealId]);
    if(!Array.isArray(data)) return;

    return data[0] as WeeklyDeal | undefined;
}