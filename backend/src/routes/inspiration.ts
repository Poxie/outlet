// @ts-ignore
import * as imageDataURI from 'image-data-uri';
import * as express from 'express';
import * as fs from 'fs';
import { myDataSource } from '../app-data-source';
import { Inspiration } from '../entity/inspiration.entity';
import { ALLOWED_INSPIRATION_PROPERTIES, REQUIRED_INSPIRATION_PROPERTIES } from '../utils/constants';
import { APIBadRequestError } from '../errors/apiBadRequestError';
import { createId } from '../utils';
import { APINotFoundError } from '../errors/apiNotFoundError';
import { Images } from '../entity/images.entity';
import { APIInternalServerError } from '../errors/apiInternalServerError';

const router = express.Router();

const getPostImages = async (parentId: string) => {
    return (await myDataSource.getRepository(Images).findBy({ parentId })).sort((a,b) => a.position - b.position);
}
router.get('/inspiration', async (req, res, next) => {
    const inspiration = await myDataSource.getRepository(Inspiration).find();

    const inspirationWithImages = [];
    for(const post of inspiration) {
        const images = await getPostImages(post.id);
        inspirationWithImages.push({
            ...post,
            images,
        })
    }

    res.send(inspirationWithImages);
})
router.get('/inspiration/:inspirationId', async (req, res, next) => {
    const inspiration = await myDataSource.getRepository(Inspiration).findOneBy({ id: req.params.inspirationId });
    if(!inspiration) return next(new APINotFoundError('Post not found.'));

    const images = await getPostImages(inspiration.id);
    res.send({
        ...inspiration,
        images,
    });
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
        if(!(prop in req.body)) continue;
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