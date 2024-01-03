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
router.patch('/stores/:storeId', authHandler, async (req, res, next) => {
    const store = await Stores.get(req.params.storeId);
    if(!store) return next(new APINotFoundError('Store was not found.'));

    if(!Object.keys(req.body).length) return next(new APIBadRequestError('No changes were provided.'));

    const storeProperties: Partial<Store> = req.body;
    for(const prop of Object.keys(storeProperties)) {
        if(!ALLOWED_STORE_PROPERTIES.includes(prop)) {
            return next(new APIBadRequestError(`${prop} is not a valid property.`));
        }
        if(REQUIRED_STORE_PROPERTIES.includes(prop) && !storeProperties[prop]) {
            return next(new APIBadRequestError(`${prop} is required.`));
        }
    }

    const newStore = await Stores.patch(req.params.storeId, storeProperties);

    res.send(newStore);
})
router.delete('/stores/:storeId', authHandler, async (req, res, next) => {
    const store = await Stores.get(req.params.storeId);
    if(!store) return next(new APINotFoundError('Store was not found.'));

    const response = await Stores.delete(req.params.storeId);

    res.send(response);
})

export default router;