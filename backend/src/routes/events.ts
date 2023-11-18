// @ts-ignore
import * as imageDataURI from 'image-data-uri';
import * as fs from 'fs';
import * as express from 'express';
import { APIBadRequestError } from '../errors/apiBadRequestError';
import { createId } from '../utils';
import { myDataSource } from '../app-data-source';
import { Events } from '../entity/events.entity';
import { APINotFoundError } from '../errors/apiNotFoundError';

const router = express.Router();

router.get('/events/all', async (req, res, next) => {
    const events = await myDataSource.getRepository(Events).find();
    res.send(events);
})

const EVENT_IMAGE_ID = 'image';
router.post('/events', async (req, res, next) => {
    const { title, description, image } = req.body;
    
    if(!title) return next(new APIBadRequestError("Title is required."));
    if(!description) return next(new APIBadRequestError("Description is required."));
    if(!image) return next(new APIBadRequestError("Image is required."));

    const date = new Date();

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

router.delete('/events/:eventId', async (req, res, next) => {
    const event = await myDataSource.getRepository(Events).findOneBy({ id: req.params.eventId });
    if(!event) return next(new APINotFoundError('Event not found.'));

    await myDataSource.getRepository(Events).delete(event);

    const date = new Date(Number(event.timestamp));
    try {
        fs.rmSync(`src/imgs/events/${date.getFullYear()}/${event.id}`, { recursive: true });
    } catch(error) {
        console.error(error);
        throw new Error('Unable to remove images.');
    }

    res.send({});
})

export default router;