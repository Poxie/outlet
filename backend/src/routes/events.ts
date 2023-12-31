// @ts-ignore
import * as imageDataURI from 'image-data-uri';
import * as fs from 'fs';
import * as express from 'express';
import { APIBadRequestError } from '../errors/apiBadRequestError';
import { createId, createUniqueIdFromName } from '../utils';
import { myDataSource } from '../app-data-source';
import { Events } from '../entity/events.entity';
import { APINotFoundError } from '../errors/apiNotFoundError';
import { ALLOWED_EVENT_PROPERTIES, MAX_EVENT_DESCRIPTION_LENGTH, MAX_EVENT_TITLE_LENGTH } from '../utils/constants';
import { APIInternalServerError } from '../errors/apiInternalServerError';
import { LessThan } from 'typeorm';
import { Images } from '../entity/images.entity';
import authHandler from '../middleware/authHandler';

const router = express.Router();

router.get('/events', async (req, res, next) => {
    const events = await myDataSource.getRepository(Events).createQueryBuilder('events')
        .where(`events.timestamp <= :timestamp AND archived = 0`, { timestamp: Date.now() })
        .orderBy('events.timestamp', 'DESC')
        .getMany();
1
    res.send(events);
})
router.get('/events/all', authHandler, async (req, res, next) => {
    const events = await myDataSource.getRepository(Events).createQueryBuilder('events')
        .orderBy('events.timestamp', 'DESC')
        .getMany();

    res.send(events);
})
router.get('/events/:eventId', async (req, res, next) => {
    const event = await myDataSource.getRepository(Events).findOneBy({ id: req.params.eventId });
    if(!event || event.archived) return next(new APINotFoundError("Event not found."));
    
    return res.send(event);
})

const EVENT_IMAGE_ID = 'image';
router.post('/events', authHandler, async (req, res, next) => {
    const { title, description, image, timestamp } = req.body;
    
    if(!title) return next(new APIBadRequestError("Title is required."));
    if(!description) return next(new APIBadRequestError("Description is required."));
    if(!image) return next(new APIBadRequestError("Image is required."));
    if(!timestamp) return next(new APIBadRequestError("Timestamp is required."));

    if(title.length > MAX_EVENT_TITLE_LENGTH) return next(new APIBadRequestError(`Title must be less than ${MAX_EVENT_TITLE_LENGTH} characters.`));
    if(description.length > MAX_EVENT_DESCRIPTION_LENGTH) return next(new APIBadRequestError(`Description must be less than ${MAX_EVENT_DESCRIPTION_LENGTH} characters.`));

    const date = new Date(Number(timestamp));
    if(!date.getTime()) return next(new APIBadRequestError("Invalid timestamp was provided."));

    const id = await createUniqueIdFromName(title, 'events');
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
router.patch('/events/:eventId', authHandler, async (req, res, next) => {
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

        if(key === 'title' && !props[key].length) return next(new APIBadRequestError('Title is required.'));
        if(key === 'description' && !props[key].length) return next(new APIBadRequestError('Description is required.'));
        
        if(key === 'title' && props[key].length > MAX_EVENT_TITLE_LENGTH) return next(new APIBadRequestError(`Title must be less than ${MAX_EVENT_TITLE_LENGTH} characters.`));
        if(key === 'description' && props[key].length > MAX_EVENT_DESCRIPTION_LENGTH) return next(new APIBadRequestError(`Description must be less than ${MAX_EVENT_DESCRIPTION_LENGTH} characters.`));
        
        propsToUpdate[key] = props[key];
    }    

    if(!Object.keys(propsToUpdate).length) return next(new APIBadRequestError('No valid properties to update were provided.'));

    const updatedEvent = await myDataSource.getRepository(Events).save({
        ...event,
        ...propsToUpdate,
    })

    res.send(updatedEvent);
})
router.delete('/events/:eventId', authHandler, async (req, res, next) => {
    const event = await myDataSource.getRepository(Events).findOneBy({ id: req.params.eventId });
    if(!event) return next(new APINotFoundError('Event not found.'));

    await myDataSource.getRepository(Events).delete({ id: event.id });
    await myDataSource.getRepository(Images).delete({ parentId: event.id });

    const date = new Date(Number(event.timestamp));
    const imagePath = `src/imgs/events/${date.getFullYear()}/${event.id}`;
    try {
        fs.rmSync(imagePath, { recursive: true });
    } catch(error) {
        console.error(`Unable to remove previous image: ${imagePath}.`, error);
    }

    res.send({});
})

export default router;