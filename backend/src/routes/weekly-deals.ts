// @ts-ignore
import * as imageDataURI from 'image-data-uri';
import * as fs from 'fs';
import * as express from 'express';
import { createId, dateToReadableString, getCurrentWeeklyDealDate } from '../utils';
import { myDataSource } from '../app-data-source';
import { WeeklyDeal } from '../entity/weekly-deal.entity';
import { WEEKLY_DEAL_DAY } from '../constants';
import { APIForbiddenError } from '../errors/apiForbiddenError';
import { APIBadRequestError } from '../errors/apiBadRequestError';
import { COUNT_DEAL_WEEKS_AHEAD, DAYS_OF_THE_WEEK } from '../utils/constants';
import { APINotFoundError } from '../errors/apiNotFoundError';
import { Images } from '../entity/images.entity';
import { In } from 'typeorm';

const router = express.Router();

const getWeeklyDealByDate = async (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    const dateString = `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;
    const deals = await myDataSource.getRepository(Images)
        .createQueryBuilder('images')
        .where('images.parentId = :parentId', { parentId: dateString })
        .orderBy('images.position', 'ASC')
        .getMany();

    return deals;
}

router.get('/weekly-deals', async (req, res) => {
    const dealDate = getCurrentWeeklyDealDate();
    const deals = await getWeeklyDealByDate(dealDate);
    
    res.send(deals);
})

const DAY_IN_MS = 1000 * 60 * 60 * 24;
router.get('/weekly-deals/all', async (req, res) => {
    const currentDealDate = getCurrentWeeklyDealDate();

    // Creating an object with empty arrays for each date
    const deals: {[date: string]: Images[]} = {};
    Array.from(Array(COUNT_DEAL_WEEKS_AHEAD)).forEach((_,key) => {
        const date = new Date(currentDealDate.getTime() + (key * DAYS_OF_THE_WEEK * DAY_IN_MS));
        const dateString = dateToReadableString(date);
        deals[dateString] = [];
    })

    const images = await myDataSource.getRepository(Images).findBy({
        parentId: In(Object.keys(deals)),
    })
    for(const image of images) {
        if(deals[image.parentId]) {
            deals[image.parentId].push(image)
            continue;
        }
        deals[image.parentId] = [image];
    }
    Object.keys(deals).forEach(key => {
        deals[key].sort((a,b) => a.position - b.position);
    })

    res.send(deals);
})

export default router;