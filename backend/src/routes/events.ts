// @ts-ignore
import * as imageDataURI from 'image-data-uri';
import * as fs from 'fs';
import * as express from 'express';
import { APIBadRequestError } from '../errors/apiBadRequestError';
import { createId } from '../utils';
import { myDataSource } from '../app-data-source';
import { Events } from '../entity/events.entity';
import { APINotFoundError } from '../errors/apiNotFoundError';
import { ALLOWED_EVENT_PROPERTIES } from '../utils/constants';
import { APIInternalServerError } from '../errors/apiInternalServerError';
import { LessThan } from 'typeorm';
import { Images } from '../entity/images.entity';

const router = express.Router();

router.get('/events', async (req, res, next) => {
    const events = await myDataSource.getRepository(Events).createQueryBuilder('events')
        .where(`events.timestamp <= :timestamp AND archived = 0`, { timestamp: Date.now() })
        .orderBy('events.timestamp', 'DESC')
        .getMany();
1
    res.send(events);
})
router.get('/events/all', async (req, res, next) => {
    const events = await myDataSource.getRepository(Events).find();
    res.send(events);
})
router.get('/events/:eventId', async (req, res, next) => {
    const event = await myDataSource.getRepository(Events).findOneBy({ id: req.params.eventId });
    if(!event || event.archived) return next(new APINotFoundError("Event not found."));
    
    return res.send(event);
})

const EVENT_IMAGE_ID = 'image';
router.post('/events', async (req, res, next) => {
    const { title, description, image, timestamp } = req.body;
    
    if(!title) return next(new APIBadRequestError("Title is required."));
    if(!description) return next(new APIBadRequestError("Description is required."));
    if(!image) return next(new APIBadRequestError("Image is required."));
    if(!timestamp) return next(new APIBadRequestError("Timestamp is required."));

    const date = new Date(Number(timestamp));
    if(!date.getTime()) return next(new APIBadRequestError("Invalid timestamp was provided."));

    const id = await createId('events');
    let imageResponse: string;
    try {
        imageResponse = await imageDataURI.outputFile(image, `src/imgs/events/${date.getFullYear()}/${id}/${EVENT_IMAGE_ID}.png`);
    } catch(error) {
        console.error(error);
        throw new Error('Unable to save image.');
    }

    const event = myDataSource.getRepository(Events).create({
        id,
        title,
        description,
        timestamp: date.getTime().toString(),
        image: EVENT_IMAGE_ID,
    })
    await myDataSource.getRepository(Events).save(event);

    res.send(event);
})
router.patch('/events/:eventId', async (req, res, next) => {
    const event = await myDataSource.getRepository(Events).findOneBy({ id: req.params.eventId });
    if(!event) return next(new APINotFoundError('Event was not found.'));

    const props = req.body;
    if(!Object.keys(props).length) return next(new APIBadRequestError('No properties to update were provided.'));

    const propsToUpdate: {[property: string]: string} = {};
    for(const key of Object.keys(props)) {
        if(!ALLOWED_EVENT_PROPERTIES.includes(key)) continue;
        if(key === 'image') {
            const image = props[key];
            const date = new Date(Number(event.timestamp));

            const prevImagePath = `src/imgs/events/${date.getFullYear()}/${event.id}/${event.image}.png`;
            try {
                fs.unlinkSync(prevImagePath);
            } catch(error) {
                console.error(`Unable to remove previous image: ${prevImagePath}.`);
            }

            const imageId = `${EVENT_IMAGE_ID}-${Math.floor(Math.random() * 1000000)}`;
            try {
                await imageDataURI.outputFile(image, `src/imgs/events/${date.getFullYear()}/${event.id}/${imageId}.png`);
            } catch(error) {
                console.error(error);
                return next(new APIInternalServerError('Unable to save image.'));
            }
            propsToUpdate[key] = imageId;
            continue;
        }
        if(key === 'archived') {
            if(!(typeof props[key] === 'boolean')) return next(new APIBadRequestError("Archived property must be a boolean."));
        }
        propsToUpdate[key] = props[key];
    }    

    if(!Object.keys(propsToUpdate).length) return next(new APIBadRequestError('No valid properties to update were provided.'));

    const updatedEvent = await myDataSource.getRepository(Events).save({
        ...event,
        ...propsToUpdate,
    })

    res.send(updatedEvent);
})
router.delete('/events/:eventId', async (req, res, next) => {
    const event = await myDataSource.getRepository(Events).findOneBy({ id: req.params.eventId });
    if(!event) return next(new APINotFoundError('Event not found.'));

    await myDataSource.getRepository(Events).delete(event);

    const date = new Date(Number(event.timestamp));
    const imagePath = `src/imgs/events/${date.getFullYear()}/${event.id}`;
    try {
        fs.rmSync(imagePath, { recursive: true });
    } catch(error) {
        console.error(`Unable to remove previous image: ${imagePath}.`);
    }

    res.send({});
})
router.get('/events/:eventId/images', async (req, res, next) => {
    const event = await myDataSource.getRepository(Events).findOneBy({ id: req.params.eventId });
    if(!event) return next(new APINotFoundError('Event not found.'));

    const images = await myDataSource.getRepository(Images).findBy({ parentId: event.id });
    res.send(images);
})
router.post('/events/:eventId/images', async (req, res, next) => {
    const event = await myDataSource.getRepository(Events).findOneBy({ id: req.params.eventId });
    if(!event) return next(new APINotFoundError('Event not found.'));

    const images = req.body.images;
    if(!images) return next(new APINotFoundError('Images property is required.'));

    const newImages: Images[] = [];
    for(const image of images) {
        const imageId = await createId('images');

        const date = new Date(Number(event.timestamp));
        const imagePath = `src/imgs/events/${date.getFullYear()}/${event.id}/${imageId}.png`;
        let imageResponse: string;
        try {
            imageResponse = await imageDataURI.outputFile(image, imagePath);
        } catch(error) {
            console.error(`Unable to remove previous image: ${imagePath}.`);
        }

        const createdImage = myDataSource.getRepository(Images).create({
            id: imageId,
            parentId: event.id,
            timestamp: event.timestamp,
        });
        const newImage = await myDataSource.getRepository(Images).save(createdImage);

        newImages.push(newImage);
    }

    res.send(newImages);
})
router.delete('/images', async (req, res, next) => {
    const ids = req.body.ids;
    if(!ids) return next(new APIBadRequestError("Ids property is required."));

    for(const id of ids) {
        const image = await myDataSource.getRepository(Images).findOneBy({ id });
        if(!image) return next(new APINotFoundError(`Image with id of "${id}" was not found.`));

        const date = new Date(Number(image.timestamp));
        const imagePath = `src/imgs/events/${date.getFullYear()}/${image.parentId}/${image.id}.png`;
        try {
            fs.rmSync(imagePath);
        } catch(error) {
            console.error(`Unable to remove image: ${imagePath}.`);
        }

        await myDataSource.getRepository(Images).delete({ id: image.id });
    }

    res.send({});
})
router.delete('/images/:imageId', async (req, res, next) => {
    const image = await myDataSource.getRepository(Images).findOneBy({ id: req.params.imageId });
    if(!image) return next(new APINotFoundError("Image not found."));
    
    const date = new Date(Number(image.timestamp));
    const imagePath = `src/imgs/events/${date.getFullYear()}/${image.parentId}/${image.id}.png`;
    try {
        fs.rmSync(imagePath);
    } catch(error) {
        console.error(`Unable to remove image: ${imagePath}.`);
    }

    await myDataSource.getRepository(Images).delete({ id: image.id });

    res.send({});
})

export default router;