// @ts-ignore
import * as imageDataURI from 'image-data-uri';
import * as express from 'express';
import { createId, dateToReadableString, getCurrentWeeklyDealDate } from '../utils';
import { myDataSource } from '../app-data-source';
import { WeeklyDeal } from '../entity/weekly-deal.entity';
import { WEEKLY_DEAL_DAY } from '../constants';
import { APIForbiddenError } from '../errors/apiForbiddenError';
import { APIBadRequestError } from '../errors/apiBadRequestError';
import { COUNT_DEAL_WEEKS_AHEAD, DAYS_OF_THE_WEEK } from '../utils/constants';

const router = express.Router();

const getWeeklyDealByDate = async (date: Date) => {
    const day = date.getDay();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    const dateString = `${day}-${month}-${year}`;
    const weeklyDeals = await myDataSource.getRepository(WeeklyDeal).findBy({
        date: dateString
    })

    return weeklyDeals;
}

router.get('/weekly-deals', async (req, res) => {
    const dealDate = getCurrentWeeklyDealDate();
    const deals = await getWeeklyDealByDate(dealDate);
    
    res.send(deals);
})

const DAY_IN_MS = 1000 * 60 * 60 * 24;
router.get('/weekly-deals/all', async (req, res) => {
    const currentDealDate = getCurrentWeeklyDealDate();
    const weeklyDeals = await myDataSource.getRepository(WeeklyDeal).createQueryBuilder('wd')
        .where('wd.timestamp >= :current_date', { current_date: currentDealDate.getTime() - DAY_IN_MS })
        .getMany();

    // Creating an object with empty arrays for each date
    const deals: {[date: string]: WeeklyDeal[]} = {};
    Array.from(Array(COUNT_DEAL_WEEKS_AHEAD)).forEach((_,key) => {
        const date = new Date();
        date.setDate(currentDealDate.getDate() + (key * DAYS_OF_THE_WEEK));

        const dateString = dateToReadableString(date);
        deals[dateString] = [];
    })

    for (const weeklyDeal of weeklyDeals) {
        if(deals[weeklyDeal.date]) {
            deals[weeklyDeal.date].push(weeklyDeal);
            continue;
        }
        deals[weeklyDeal.date] = [weeklyDeal];
    }

    res.send(deals);
})
router.post('/weekly-deals/:timestamp/images', async (req, res, next) => {
    const image = req.body.image;
    if(!image) return next(new APIBadRequestError('Image is required.'));

    const timestamp = req.params.timestamp;
    const date = new Date(Number(timestamp));
    if(date.getDay() !== WEEKLY_DEAL_DAY) return next(new APIForbiddenError('The inputted timestamp is not a deal day.'));

    const dateString = dateToReadableString(date);

    const id = await createId('weekly_deal');
    let imageResponse: string;
    try {
        imageResponse = await imageDataURI.outputFile(image, `src/imgs/weekly-deals/${date.getFullYear()}/${dateString.split('-').reverse().slice(1).join('-')}/${id}.png`);
    } catch(error) {
        console.error(error);
        throw new Error('Unable to save image.');
    }

    const imageData = myDataSource.getRepository(WeeklyDeal).create({
        id,
        date: dateString,
        timestamp,
    })
    await myDataSource.getRepository(WeeklyDeal).save(imageData);

    res.send({ id, date: dateString, timestamp });
})

export default router;