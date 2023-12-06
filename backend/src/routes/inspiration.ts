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

router.get('/inspiration', async (req, res, next) => {
    const inspiration = await myDataSource.getRepository(Inspiration).find();

    const inspirationWithImages = [];
    for(const post of inspiration) {
        const images = await myDataSource.getRepository(Images).findBy({
            parentId: post.id,
        })
        inspirationWithImages.push({
            ...post,
            images: images.sort((a,b) => a.position - b.position),
        })
    }

    res.send(inspirationWithImages);
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
router.post('/inspiration/:inspirationId/images', async (req, res, next) => {
    const post = await myDataSource.getRepository(Inspiration).findOneBy({ id: req.params.inspirationId });
    if(!post) return next(new APINotFoundError('Post not found.'));

    const images = req.body.images;
    if(!images) return next(new APINotFoundError('Images property is required.'));

    const currentImageCount = await myDataSource.getRepository(Images)
        .createQueryBuilder('images')
        .where('images.parentId = :parentId', { parentId: post.id })
        .orderBy('images.positions', 'DESC')
        .getCount();

    const newImages: Images[] = [];
    for(let i = 0; i < images.length; i++) {
        const image = images[i];
        const imageId = await createId('images');
    
        const imagePath = `src/imgs/blog/${post.id}/${imageId}.png`;
        let imageResponse: string;
        try {
            imageResponse = await imageDataURI.outputFile(image, imagePath);
        } catch(error) {
            console.error(`Unable to save image ${imagePath}.`, error);
            return next(new APIInternalServerError('Unable to save image.'));
        }
    
        const createdImage = myDataSource.getRepository(Images).create({
            id: imageId,
            image: imageId,
            parentId: post.id,
            timestamp: post.timestamp,
            position: currentImageCount + i,
        });
        const newImage = await myDataSource.getRepository(Images).save(createdImage);
    
        newImages.push(newImage);
    }

    res.send(newImages);
})
router.patch('/inspiration/:inspirationId/images/positions', async (req, res, next) => {
    const post = await myDataSource.getRepository(Inspiration).findOneBy({ id: req.params.inspirationId });
    if(!post) return next(new APINotFoundError('Post not found.'));

    const positions = req.body.positions;
    if(!positions) return next(new APIBadRequestError('Positions is required.'));
    if(!Array.isArray(positions)) return next(new APIBadRequestError('Positions must be an array.'));

    let prevPositions: number[] = [];
    for(const item of positions.sort((a,b) => a.position - b.position)) {
        if(item.position === undefined || item.id === undefined) {
            return next(new APIBadRequestError('Array items must have an id and a position.'));
        }
        if(!prevPositions.length) {
            if(item.position !== 0) return next(new APIBadRequestError('First position must be 0.'));
            prevPositions.push(item.position);
            continue;
        }

        if(item.position !== prevPositions.at(-1) + 1) return next(new APIBadRequestError('Positions must be in a consecutive order.'));
        prevPositions.push(item.position)
    }

    for(const item of positions) {
        await myDataSource.getRepository(Images).update({
            id: item.id,
        }, {
            position: item.position,
        })
    }

    const images = await myDataSource.getRepository(Images)
        .createQueryBuilder('images')
        .where('images.parentId = :parentId', { parentId: post.id })
        .orderBy('images.position', 'ASC')
        .getMany();
        
    res.send(images);
})
router.delete('/inspiration/:inspirationId/images', async (req, res, next) => {
    const post = await myDataSource.getRepository(Inspiration).findOneBy({ id: req.params.inspirationId });
    if(!post) return next(new APINotFoundError('Post not found.'));

    const ids = req.body.ids;
    if(!ids) return next(new APIBadRequestError("Ids property is required."));

    for(const id of ids) {
        const image = await myDataSource.getRepository(Images).findOneBy({ id });
        if(!image) return next(new APINotFoundError(`Image with id of "${id}" was not found.`));

        const imagePath = `src/imgs/blog/${image.parentId}/${image.id}.png`;
        try {
            fs.rmSync(imagePath);
        } catch(error) {
            console.error(`Unable to remove image: ${imagePath}.`);
        }

        await myDataSource.getRepository(Images).delete({ id: image.id });
        
        // Updating other images' positions
        const imagesToUpdate = await myDataSource.getRepository(Images)
            .createQueryBuilder('images')
            .where('images.position > :position AND images.parentId = :parentId', { position: image.position, parentId: post.id })
            .getMany();

        for(const imageToUpdate of imagesToUpdate) {
            await myDataSource.getRepository(Images).save({
                ...imageToUpdate,
                position: imageToUpdate.position - 1,
            })
        }
    }

    res.send({});
})

export default router;