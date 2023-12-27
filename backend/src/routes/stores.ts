import * as express from 'express';
import { myDataSource } from '../app-data-source';
import { ALLOWED_STORE_PROPERTIES, REQUIRED_STORE_PROPERTIES, STORE_LENGTHS } from '../utils/constants';
import { APIBadRequestError } from '../errors/apiBadRequestError';
import { APINotFoundError } from '../errors/apiNotFoundError';
import { cleanString, createUniqueIdFromName } from '../utils';
import Stores from '../modules/stores';
import { Store } from '../entity/store.entity';
import authHandler from '../middleware/authHandler';

const router = express.Router();

router.get('/stores', async (req, res, next) => {
    const stores = await Stores.all();
    res.send(stores);
})
router.put('/stores', authHandler, async (req, res, next) => {
    if(!Object.keys(req.body).length) return next(new APIBadRequestError('No store data was provided.'));

    const storeProperties: Omit<Store, 'id' | 'addedAt'> = req.body;
    for(const prop of Object.keys(storeProperties)) {
        if(!ALLOWED_STORE_PROPERTIES.includes(prop)) {
            return next(new APIBadRequestError(`${prop} is not a valid property.`));
        }
    }
    for(const prop of REQUIRED_STORE_PROPERTIES) {
        if(!storeProperties[prop]) {
            return next(new APIBadRequestError(`${prop} is required.`));
        }
    }

    const id = cleanString(storeProperties.name);
    const createdStore = await Stores.put({
        id,
        addedAt: Date.now().toString(),
        ...storeProperties,
    })

    res.send(createdStore);
})
router.delete('/stores/:storeId', authHandler, async (req, res, next) => {
    const store = await myDataSource.getRepository(Store).findOneBy({ id: req.params.storeId });
    if(!store) return next(new APINotFoundError('Store was not found.'));

    await myDataSource.getRepository(Store).remove(store);

    res.send({});
})
router.patch('/stores/:storeId', authHandler, async (req, res, next) => {
    const store = await myDataSource.getRepository(Store).findOneBy({ id: req.params.storeId });
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

    const newStore = await myDataSource.getRepository(Store).save({
        ...store,
        ...changes,
    })

    res.send(newStore);
})

export default router;