import * as express from 'express';
import { myDataSource } from '../app-data-source';
import { Inspiration } from '../entity/inspiration.entity';
import { ALLOWED_INSPIRATION_PROPERTIES, REQUIRED_INSPIRATION_PROPERTIES } from '../utils/constants';
import { APIBadRequestError } from '../errors/apiBadRequestError';
import { createId } from '../utils';
import { APINotFoundError } from '../errors/apiNotFoundError';

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
router.patch('/inspiration/:inspirationId', async (req, res, next) => {
    const inspiration = await myDataSource.getRepository(Inspiration).findOneBy({ id: req.params.inspirationId });
    if(!inspiration) return next(new APINotFoundError('Post not found.'));
    
    const changes: {[key: string]: string} = {};
    for(const prop of ALLOWED_INSPIRATION_PROPERTIES) {
        if(!req.body[prop]) continue;
        changes[prop] = req.body[prop];
    }
    if(!Object.keys(changes).length) return next(new APIBadRequestError('No properties to update were provided'));

    const newInspiration = await myDataSource.getRepository(Inspiration).save({
        ...inspiration,
        ...changes,
    });
    
    res.send(newInspiration);
})
router.delete('/inspiration/:inspirationId', async (req, res, next) => {
    const inspiration = await myDataSource.getRepository(Inspiration).findOneBy({ id: req.params.inspirationId });
    if(!inspiration) return next(new APINotFoundError('Post not found.'));

    await myDataSource.getRepository(Inspiration).delete(inspiration);

    res.send({});
})

export default router;