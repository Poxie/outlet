import { EntityTarget, ObjectLiteral } from "typeorm";
import { myDataSource } from "../app-data-source";
import { WeeklyDeal } from "../entity/weekly-deal.entity";
import { DEAL_DAY_ID, IMAGE_TYPE_REPOSITORIES } from "./constants";
import { Events } from "../entity/events.entity";
import { Images } from "../entity/images.entity";
import { Banners } from "../entity/banners.entity";
import { Inspiration } from "../entity/inspiration.entity";

export const dateToReadableString = (date: Date) => `${String(date.getDate()).padStart(2,'0')}-${String(date.getMonth() + 1).padStart(2,'0')}-${date.getFullYear()}`

export const getCurrentWeeklyDealDate = () => {
    const currentDealDate = new Date();
    currentDealDate.setDate(currentDealDate.getDate() - ( currentDealDate.getDay() == DEAL_DAY_ID ? 7 : (currentDealDate.getDay() + (7 - DEAL_DAY_ID)) % 7 ));
    return currentDealDate;
}

type DatabaseTable = 'weekly_deal' | 'events' | 'images' | 'banners' | 'inspiration' | 'category';
const repositories = {
    'weekly_deal': WeeklyDeal,
    events: Events,
    images: Images,
    banners: Banners,
    inspiration: Inspiration,
}

const generateRandomNumbers = (length: number) => {
    const opts = '1234567890';
    
    let id = '';
    for(let i = 0; i < length; i++) {
        id += Math.floor(Math.random() * opts.length);
    }
    return id;
}
export const createId = async (table: DatabaseTable) => {
    const id = generateRandomNumbers(8);

    const repository =  repositories[table];
    if(!repository) throw new Error(`Repository ${table} has not been set up.`);
    const alreadyExists = await myDataSource.getRepository(repository).findOneBy({ id });
    if(alreadyExists) return await createId(table);

    return id;
}

export const createUniqueIdFromName = async (name: string, table: DatabaseTable) => {
    const prelimId = name.toLowerCase().split(' ').join('-')
        .replace(/å/g, 'a')
        .replace(/ä/g, 'a')
        .replace(/ö/g, 'o')
        .replace(/!/g, '')
        .replace(/\?/g, '')
        .replace(/=/g, '');

    const previousItem = await myDataSource.getRepository(table).findOneBy({ id: prelimId });

    let id = prelimId;
    if(previousItem) {
        const generateId = async () => {
            const tempId = `${id}-${generateRandomNumbers(4)}`;
            const prev = await myDataSource.getRepository(table).findOneBy({ id: tempId });
            
            return prev ? await generateId() : tempId;
        }
        id = await generateId();
    }
    
    return id;
}

export const getParentRepository = (imageType: keyof typeof IMAGE_TYPE_REPOSITORIES) => IMAGE_TYPE_REPOSITORIES[imageType];