import * as express from 'express';
import { myDataSource } from '../app-data-source';
import { Stores } from '../entity/stores.entity';
import { ALLOWED_STORE_PROPERTIES, REQUIRED_STORE_PROPERTIES } from '../utils/constants';
import { APIBadRequestError } from '../errors/apiBadRequestError';

const router = express.Router();

router.get('/stores', async (req, res, next) => {
    const stores = await myDataSource.getRepository(Stores).find();
    res.send(stores);
})
router.put('/stores', async (req, res, next) => {
    for(const prop of REQUIRED_STORE_PROPERTIES) {
        if(!req.body[prop]) return next(new APIBadRequestError(`${prop} is required.`));
    }

    const props = {};
    for(const prop of ALLOWED_STORE_PROPERTIES) {
        props[prop] = req.body[prop];
    }

    const id = req.body.name.toLowerCase().replaceAll(' ', '-');

    const newStore = myDataSource.getRepository(Stores).create({
        id,
        addedAt: Date.now().toString(),
        ...props,
    });
    await myDataSource.getRepository(Stores).save(newStore);

    res.send(newStore);
})

export default router;