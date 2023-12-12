// @ts-ignore
import * as imageDataURI from 'image-data-uri';
import * as express from 'express';
import * as fs from 'fs';
import { ACCEPTED_IMAGE_TYPES } from '../utils/constants';
import { APIBadRequestError } from '../errors/apiBadRequestError';
import { myDataSource } from '../app-data-source';
import { Events } from '../entity/events.entity';
import { APINotFoundError } from '../errors/apiNotFoundError';
import { Images } from '../entity/images.entity';
import { createId } from '../utils';

const router = express.Router();

const IMAGE_TYPES = {
    EVENTS: 'events',
}
const BASE_PATH = 'src/imgs'
const imagePaths = {
    events: ({ timestamp, eventId, imageId }: {
        timestamp: string;
        eventId: string;
        imageId: string;
    }) => {
        const date = new Date(Number(timestamp));
        return `${BASE_PATH}/events/${date.getFullYear()}/${eventId}/${imageId}.png`;
    }
}
router.get('/images/:imageType/:relevantId', async (req, res, next) => {
    const imageType = req.params.imageType;
    if(!ACCEPTED_IMAGE_TYPES.includes(imageType)) {
        return next(new APIBadRequestError('Invalid image type.'));
    }

    if(imageType === IMAGE_TYPES.EVENTS) {
        const event = await myDataSource.getRepository(Events).findOneBy({ id: req.params.relevantId });
        if(!event) {
            return next(new APINotFoundError('Event not found.'));
        }

        const images = await myDataSource.getRepository(Images)
            .createQueryBuilder('images')
            .where('images.parentId = :parentId', { parentId: event.id })
            .orderBy('images.position', 'DESC')
            .getMany();

        return res.send(images);
    }
})
router.post('/images/:imageType/:relevantId', async (req, res, next) => {
    const relevantId = req.params.relevantId;
    const imageType = req.params.imageType;
    if(!ACCEPTED_IMAGE_TYPES.includes(imageType)) {
        return next(new APIBadRequestError('Invalid image type.'));
    }

    if(imageType === IMAGE_TYPES.EVENTS) {
        const images = req.body.images;
        if(!images) return next(new APIBadRequestError('images is required.'));
        if(!Array.isArray(images)) return next(new APIBadRequestError('images must be an array.'));

        const event = await myDataSource.getRepository(Events).findOneBy({ id: relevantId });
        if(!event) return next(new APINotFoundError('Event not found.'));

        const newImages = [];
        for(const image of images) {
            const imageId = await createId('images');

            let imageResponse: string;
            try {
                imageResponse = await imageDataURI.outputFile(image, imagePaths.events({ imageId, eventId: relevantId, timestamp: event.timestamp }));
            } catch(error) {
                console.error(error);
                throw new Error('Unable to save image.');
            }
            
            const prevCount = await myDataSource.getRepository(Images)
                .createQueryBuilder('images')
                .where('images.parentId = :parentId', { parentId: relevantId })
                .getCount();

            const newImage = myDataSource.getRepository(Images).create({
                id: imageId,
                image: imageId,
                position: prevCount,
                parentId: relevantId,
                timestamp: event.timestamp,
            })
            await myDataSource.getRepository(Images).save(newImage);
            newImages.push(newImage);
        }

        return res.send(newImages);
    }
})
router.delete('/images/:imageType/:relevantId', async (req, res, next) => {
    const relevantId = req.params.relevantId;
    const imageType = req.params.imageType;
    if(!ACCEPTED_IMAGE_TYPES.includes(imageType)) {
        return next(new APIBadRequestError('Invalid image type.'));
    }

    if(imageType === IMAGE_TYPES.EVENTS) {
        const imageIds = req.body.imageIds;
        if(!imageIds) return next(new APIBadRequestError('imageIds is required.'));
        if(!Array.isArray(imageIds)) return next(new APIBadRequestError('imageIds must be an array.'));

        const event = await myDataSource.getRepository(Events).findOneBy({ id: relevantId });
        if(!event) return next(new APINotFoundError('Event not found.'));

        for(const imageId of imageIds) {
            const image = await myDataSource.getRepository(Images).findOneBy({ id: imageId });
            if(!image) {
                console.warn(`Image with id ${imageId} not found.`);
                continue;
            }

            await myDataSource.getRepository(Images).delete(image);

            const imagePath = imagePaths.events({ imageId, timestamp: event.timestamp, eventId: event.id });
            try {
                fs.unlinkSync(imagePath)
            } catch(error) {
                console.error(`Image with path ${imagePath} could not be removed: `, error);
            }

            // Updating other images' positions
            const imagesToUpdate = await myDataSource.getRepository(Images)
                .createQueryBuilder('images')
                .where('images.parentId = :parentId AND images.position >= :position', {
                    parentId: relevantId, position: image.position 
                })
                .getMany();

            for(const image of imagesToUpdate) {
                await myDataSource.getRepository(Images).update(
                    { id: image.id },
                    { position: image.position - 1 },
                )
            }

        }

        return res.send({});
    }
})
router.patch('/images/:imageType/:relevantId', async (req, res, next) => {
    const relevantId = req.params.relevantId;
    const imageType = req.params.imageType;
    if(!ACCEPTED_IMAGE_TYPES.includes(imageType)) {
        return next(new APIBadRequestError('Invalid image type.'));
    }

    if(imageType === IMAGE_TYPES.EVENTS) {
        const positions = req.body.positions;
        if(!positions) return next(new APIBadRequestError('positions is required.'));
        if(!Array.isArray(positions)) return next(new APIBadRequestError('positions must be an array.'));

        let currentPos = null;
        for(const pos of positions) {
            if(!currentPos && pos.position === 0) {
                currentPos = 0;
                continue;
            }
            if(pos.position !== currentPos + 1) {
                return next(new APIBadRequestError('Positions must be in consecutive order.'));
            }
            currentPos++;
        }

        const event = await myDataSource.getRepository(Events).findOneBy({ id: relevantId });
        if(!event) return next(new APINotFoundError('Event not found.'));

        for(const pos of positions) {
            await myDataSource.getRepository(Images).update(
                { id: pos.id },
                { position: pos.position },
            )
        }

        const newImages = await myDataSource.getRepository(Images)
            .createQueryBuilder('images')
            .where('images.parentId = :parentId', { parentId: relevantId })
            .orderBy('images.position', 'ASC')
            .getMany();

        return res.send(newImages);
    }
})

export default router;