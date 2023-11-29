import { EntityTarget, ObjectLiteral } from "typeorm";
import { myDataSource } from "../app-data-source";
import { WeeklyDeal } from "../entity/weekly-deal.entity";
import { DEAL_DAY_ID } from "./constants";
import { Events } from "../entity/events.entity";
import { Images } from "../entity/images.entity";
import { Banners } from "../entity/banners.entity";

export const dateToReadableString = (date: Date) => `${String(date.getDate()).padStart(2,'0')}-${String(date.getMonth() + 1).padStart(2,'0')}-${date.getFullYear()}`

export const getCurrentWeeklyDealDate = () => {
    const currentDealDate = new Date();
    currentDealDate.setDate(currentDealDate.getDate() - ( currentDealDate.getDay() == DEAL_DAY_ID ? 7 : (currentDealDate.getDay() + (7 - DEAL_DAY_ID)) % 7 ));
    return currentDealDate;
}

const repositories = {
    'weekly_deal': WeeklyDeal,
    events: Events,
    images: Images,
    banners: Banners,
}
export const createId = async (table: 'weekly_deal' | 'events' | 'images' | 'banners') => {
    const length = 8;
    const opts = '1234567890';
    
    let id = '';
    for(let i = 0; i < length; i++) {
        id += Math.floor(Math.random() * opts.length);
    }

    const repository =  repositories[table];
    if(!repository) throw new Error(`Repository ${table} has not been set up.`);
    const alreadyExists = await myDataSource.getRepository(repository).findOneBy({ id });
    if(alreadyExists) return await createId(table);

    return id;
}