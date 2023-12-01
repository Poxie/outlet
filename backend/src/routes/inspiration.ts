import * as express from 'express';
import { myDataSource } from '../app-data-source';
import { Inspiration } from '../entity/inspiration.entity';
import { ALLOWED_INSPIRATION_PROPERTIES, REQUIRED_INSPIRATION_PROPERTIES } from '../utils/constants';
import { APIBadRequestError } from '../errors/apiBadRequestError';
import { createId } from '../utils';

const router = express.Router();

router.get('/inspiration', async (req, res, next) => {
    const inspiration = await myDataSource.getRepository(Inspiration).find();
    res.send(inspiration);
})
router.post('/inspiration', async (req, res, next) => {
    for(const prop of REQUIRED_INSPIRATION_PROPERTIES) {
        if(!(prop in req.body)) return next(new APIBadRequestError(`${prop} is required.`));
    }

    const changes: {[key: string]: string} = {};
    for(const prop of ALLOWED_INSPIRATION_PROPERTIES) {
        changes[prop] = req.body[prop];
    }

    const id = await createId('inspiration')
    const post = myDataSource.getRepository(Inspiration).create({
        id,
        ...changes,
    })
    await myDataSource.getRepository(Inspiration).save(post);

    res.send(post);
})

export default router;