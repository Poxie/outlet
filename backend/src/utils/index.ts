import { EntityTarget, ObjectLiteral } from "typeorm";
import { myDataSource } from "../app-data-source";
import { WeeklyDeal } from "../entity/weekly-deal.entity";
import { DEAL_DAY_ID } from "./constants";
import { Events } from "../entity/events.entity";

export const dateToReadableString = (date: Date) => `${String(date.getDate()).padStart(2,'0')}-${String(date.getMonth() + 1).padStart(2,'0')}-${date.getFullYear()}`

export const getCurrentWeeklyDealDate = () => {
    const currentDealDate = new Date();
    currentDealDate.setDate(currentDealDate.getDate() - ( currentDealDate.getDay() == DEAL_DAY_ID ? 7 : (currentDealDate.getDay() + (7 - DEAL_DAY_ID)) % 7 ));
    return currentDealDate;
}

export const createId = async (table: 'weekly_deal' | 'events') => {
    const length = 8;
    const opts = '1234567890';
    
    let id = '';
    for(let i = 0; i < length; i++) {
        id += Math.floor(Math.random() * opts.length);
    }

    let repository: EntityTarget<ObjectLiteral>;
    switch(table) {
        case 'weekly_deal': {
            repository = WeeklyDeal;
            break;
        }
        case 'events': {
            repository = Events;
            break;
        }
        default:
            throw new Error(`Table ${table} is not a valid table.`);
    }    
    const alreadyExists = await myDataSource.getRepository(repository).findOneBy({ id });
    if(alreadyExists) return await createId(table);

    return id;
}