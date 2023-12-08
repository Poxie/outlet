import * as express from 'express';
import { myDataSource } from '../app-data-source';
import { APIBadRequestError } from '../errors/apiBadRequestError';
import { createUniqueIdFromName } from '../utils';
import { Category } from '../entity/category.entity';
import { ALLOWED_CATEGORY_PROPERTIES, REQUIRED_CATEGORY_PROPERTIES } from '../utils/constants';

const router = express.Router();

router.get('/categories', async (req, res, next) => {
    const categories = await myDataSource.getRepository(Category).find();
    res.send(categories);
})
router.post('/categories', async (req, res, next) => {
    const properties: {[key: string]: any} = {};
    for(const [prop, val] of Object.entries(req.body)) {
        if(!ALLOWED_CATEGORY_PROPERTIES.includes(prop)) {
            return next(new APIBadRequestError(`${prop} is not a valid property.`));
        }
        properties[prop] = val;
    }
    
    const keys = Object.keys(properties);
    const hasInvalidPropVals = REQUIRED_CATEGORY_PROPERTIES.find(prop => !keys.includes(prop));
    if(hasInvalidPropVals) {
        return next(new APIBadRequestError(`${hasInvalidPropVals} is required.`));
    }

    const id = await createUniqueIdFromName(properties.name, 'category');
    const category = myDataSource.getRepository(Category).create({
        id,
        timestamp: Date.now().toString(),
        ...properties,
    });
    await myDataSource.getRepository(Category).save(category);

    res.send(category);
})

export default router;