import * as express from 'express';
import { myDataSource } from '../app-data-source';
import { APIBadRequestError } from '../errors/apiBadRequestError';
import { createUniqueIdFromName } from '../utils';
import { Category } from '../entity/category.entity';
import { ALLOWED_CATEGORY_PROPERTIES, REQUIRED_CATEGORY_PROPERTIES } from '../utils/constants';
import { Events } from '../entity/events.entity';
import { APINotFoundError } from '../errors/apiNotFoundError';
import { In } from 'typeorm';

const router = express.Router();

router.get('/categories', async (req, res, next) => {
    const categories = await myDataSource.getRepository(Category).find();

    const categoriesWithEventCount = [];
    for(const category of categories) {
        const [_, eventCount] = await myDataSource.getRepository(Events).findAndCountBy({ id: category.id });
        categoriesWithEventCount.push({
            ...category,
            eventCount,
        })
    }

    res.send(categoriesWithEventCount);
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
});
router.delete('/categories/:categoryId', async (req, res, next) => {
    const category = await myDataSource.getRepository(Category).findOneBy({ id: req.params.categoryId });
    if(!category) return next(new APINotFoundError('Category not found.'));

    await myDataSource.getRepository(Category).delete({ id: category.id });
    await myDataSource.getRepository(Events).update(
        { parentId: category.id },
        { parentId: null },
    )

    res.send({});
})

export default router;