import * as express from 'express';
import { myDataSource } from '../app-data-source';
import { Stores } from '../entity/stores.entity';
import { ALLOWED_STORE_PROPERTIES, REQUIRED_STORE_PROPERTIES, STORE_LENGTHS } from '../utils/constants';
import { APIBadRequestError } from '../errors/apiBadRequestError';
import { APINotFoundError } from '../errors/apiNotFoundError';
import { authHandler } from '../middleware/authHandler';
import { createUniqueIdFromName } from '../utils';

const router = express.Router();

router.get('/stores', async (req, res, next) => {
    const stores = await myDataSource.getRepository(Stores).find();
    res.send(stores);
})
router.put('/stores', authHandler, async (req, res, next) => {
    for(const prop of REQUIRED_STORE_PROPERTIES) {
        if(!req.body[prop]) return next(new APIBadRequestError(`${prop} is required.`));
    }

    const props = {};
    for(const prop of ALLOWED_STORE_PROPERTIES) {
        const value = req.body[prop];
        if(!value) continue;

        const limit = STORE_LENGTHS[prop].max;
        if(value.length > limit) {
            next(new APIBadRequestError(`${prop} must be less than ${limit} characters.`));
            return;
        }

        props[prop] = value;
    }

    const id = await createUniqueIdFromName(req.body.name, 'stores');
    const newStore = myDataSource.getRepository(Stores).create({
        id,
        addedAt: Date.now().toString(),
        ...props,
    });
    await myDataSource.getRepository(Stores).save(newStore);

    res.send(newStore);
})
router.delete('/stores/:storeId', authHandler, async (req, res, next) => {
    const store = await myDataSource.getRepository(Stores).findOneBy({ id: req.params.storeId });
    if(!store) return next(new APINotFoundError('Store was not found.'));

    await myDataSource.getRepository(Stores).remove(store);

    res.send({});
})
router.patch('/stores/:storeId', authHandler, async (req, res, next) => {
    const store = await myDataSource.getRepository(Stores).findOneBy({ id: req.params.storeId });
    if(!store) return next(new APINotFoundError('Store was not found.'));

    const changes = {};
    for(const prop of ALLOWED_STORE_PROPERTIES) {
        const value = req.body[prop];
        
        if(typeof value === 'undefined') continue;
        if(REQUIRED_STORE_PROPERTIES.includes(prop) && !value) {
            return next(new APIBadRequestError(`${prop} is required.`));
        }
        
        const limit = STORE_LENGTHS[prop].max;
        if(value && value.length > limit) {
            next(new APIBadRequestError(`${prop} must be less than ${limit} characters.`));
            return;
        }

        changes[prop] = value;
    }

    const newStore = await myDataSource.getRepository(Stores).save({
        ...store,
        ...changes,
    })

    res.send(newStore);
})

export default router;