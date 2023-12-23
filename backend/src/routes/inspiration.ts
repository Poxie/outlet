import * as express from 'express';
import { myDataSource } from '../app-data-source';
import { Inspiration } from '../entity/inspiration.entity';
import { ALLOWED_INSPIRATION_PROPERTIES, IMAGE_TYPES, MAX_POST_DESCRIPTION_LENGTH, MAX_POST_TITLE_LENGTH, REQUIRED_INSPIRATION_PROPERTIES } from '../utils/constants';
import { APIBadRequestError } from '../errors/apiBadRequestError';
import { createUniqueIdFromName } from '../utils';
import { APINotFoundError } from '../errors/apiNotFoundError';
import { Images } from '../entity/images.entity';
import { authHandler } from '../middleware/authHandler';

const router = express.Router();

const getPostImages = async (parentId: string) => {
    return (await myDataSource.getRepository(Images).findBy({ parentId, type: IMAGE_TYPES.inspiration })).sort((a,b) => a.position - b.position);
}
router.get('/inspiration', async (req, res, next) => {
    const inspiration = await myDataSource.getRepository(Inspiration)
        .createQueryBuilder('inspiration')
        .orderBy('inspiration.timestamp', 'DESC')
        .getMany();

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
router.post('/inspiration', authHandler, async (req, res, next) => {
    for(const prop of REQUIRED_INSPIRATION_PROPERTIES) {
        if(prop === 'title' && req.body[prop].length > MAX_POST_TITLE_LENGTH) return next(new APIBadRequestError(`Title must be less than ${MAX_POST_TITLE_LENGTH} characters.`));
        if(prop === 'description' && req.body[prop].length > MAX_POST_DESCRIPTION_LENGTH) return next(new APIBadRequestError(`Description must be less than ${MAX_POST_DESCRIPTION_LENGTH} characters.`));

        if(!(prop in req.body)) return next(new APIBadRequestError(`${prop} is required.`));
    }

    const changes: {[key: string]: string} = {};
    for(const prop of ALLOWED_INSPIRATION_PROPERTIES) {
        changes[prop] = req.body[prop];
    }

    const id = await createUniqueIdFromName(req.body.title, 'inspiration');
    const post = myDataSource.getRepository(Inspiration).create({
        id,
        ...changes,
    })
    await myDataSource.getRepository(Inspiration).save(post);

    res.send({
        ...post,
        images: [],
    });
})
router.patch('/inspiration/:inspirationId', authHandler, async (req, res, next) => {
    const inspiration = await myDataSource.getRepository(Inspiration).findOneBy({ id: req.params.inspirationId });
    if(!inspiration) return next(new APINotFoundError('Post not found.'));
    
    const changes: {[key: string]: string} = {};
    for(const prop of ALLOWED_INSPIRATION_PROPERTIES) {
        if(!(prop in req.body)) continue;
        
        if(prop === 'title' && req.body[prop].length > MAX_POST_TITLE_LENGTH) return next(new APIBadRequestError(`Title must be less than ${MAX_POST_TITLE_LENGTH} characters.`));
        if(prop === 'description' && req.body[prop].length > MAX_POST_DESCRIPTION_LENGTH) return next(new APIBadRequestError(`Description must be less than ${MAX_POST_DESCRIPTION_LENGTH} characters.`));

        changes[prop] = req.body[prop];
    }
    if(!Object.keys(changes).length) return next(new APIBadRequestError('No properties to update were provided'));

    const newInspiration = await myDataSource.getRepository(Inspiration).save({
        ...inspiration,
        ...changes,
    });
    
    res.send(newInspiration);
})
router.delete('/inspiration/:inspirationId', authHandler, async (req, res, next) => {
    const inspiration = await myDataSource.getRepository(Inspiration).findOneBy({ id: req.params.inspirationId });
    if(!inspiration) return next(new APINotFoundError('Post not found.'));

    await myDataSource.getRepository(Inspiration).delete(inspiration);

    res.send({});
})

export default router;