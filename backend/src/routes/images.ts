// @ts-ignore
import * as imageDataURI from 'image-data-uri';
import * as express from 'express';
import * as fs from 'fs';
import { ACCEPTED_IMAGE_TYPES, IMAGE_TYPES, ImageType } from '../utils/constants';
import { APIBadRequestError } from '../errors/apiBadRequestError';
import { myDataSource } from '../app-data-source';
import { Events } from '../entity/events.entity';
import { APINotFoundError } from '../errors/apiNotFoundError';
import { Images } from '../entity/images.entity';
import { createId, getParentRepository, isDealDate } from '../utils';
import { APIInternalServerError } from '../errors/apiInternalServerError';
import { WEEKLY_DEAL_DAY } from '../constants';
import { Inspiration } from '../entity/inspiration.entity';
import { WeeklyDeal } from '../entity/weekly-deal.entity';
import { authHandler } from '../middleware/authHandler';

const router = express.Router();

const BASE_PATH = 'src/imgs'
const imagePaths = {
    [IMAGE_TYPES.events]: ({ timestamp, eventId, imageId }: {
        timestamp: string;
        eventId: string;
        imageId: string;
    }) => {
        const date = new Date(Number(timestamp));
        return `${BASE_PATH}/events/${date.getFullYear()}/${eventId}/${imageId}.png`;
    },
    [IMAGE_TYPES.inspiration]: ({ parentId, imageId }: { parentId: string, imageId: string }) => {
        return `${BASE_PATH}/blog/${parentId}/${imageId}.png`;
    },
    [IMAGE_TYPES.deals]: ({ id, date }: {
        id: string;
        date: string;
    }) => {
        const [day, month, year] = date.split('-');
        return `${BASE_PATH}/weekly-deals/${year}/${month}-${day}/${id}.png`;
    },
}
router.get('/images/:imageType/:relevantId', async (req, res, next) => {
    const imageType = req.params.imageType as ImageType;
    if(!ACCEPTED_IMAGE_TYPES.includes(imageType)) {
        return next(new APIBadRequestError('Invalid image type.'));
    }

    const images = await myDataSource.getRepository(Images)
        .createQueryBuilder('images')
        .where('images.parentId = :parentId AND type = :type', { parentId: req.params.relevantId, type: imageType })
        .orderBy('images.position', 'ASC')
        .getMany();

    return res.send(images);
})
router.post('/images/:imageType/:relevantId', authHandler, async (req, res, next) => {
    const relevantId = req.params.relevantId;
    const imageType = req.params.imageType as ImageType;
    if(!ACCEPTED_IMAGE_TYPES.includes(imageType)) {
        return next(new APIBadRequestError('Invalid image type.'));
    }

    const images = req.body.images;
    if(!images) return next(new APIBadRequestError('images is required.'));
    if(!Array.isArray(images)) return next(new APIBadRequestError('images must be an array.'));

    let parent: Inspiration | Events | WeeklyDeal;
    if(imageType === IMAGE_TYPES.deals) {
        if(!isDealDate(relevantId)) {
            return next(new APIBadRequestError('Date is not a deal date.'));
        }
    } else {
        parent = await myDataSource.getRepository(getParentRepository(imageType)).findOneBy({ id: relevantId });
        if(!parent) {
            return next(new APINotFoundError('Parent not found'));
        }
    }

    let timestamp = parent?.timestamp;
    const newImages = [];
    for(const image of images) {
        const imageId = await createId('images');

        let imageResponse: string;
        try {
            let imagePath = '';
            switch(imageType) {
                case IMAGE_TYPES.events: {
                    imagePath = imagePaths[imageType]({ imageId, timestamp: parent.timestamp, eventId: parent.id });
                    break;
                }
                case IMAGE_TYPES.inspiration: {
                    imagePath = imagePaths[imageType]({ parentId: parent.id, imageId });
                    break;
                }
                case IMAGE_TYPES.deals: {
                    const [day,month,year] = relevantId.split('-');
                    const date = new Date(Number(year), Number(month) - 1, Number(day));
                    if(date.getDay() !== WEEKLY_DEAL_DAY) {
                        return next(new APIBadRequestError('The provided date is not a deal-date.'));
                    }

                    timestamp = date.getTime().toString();
                    imagePath = imagePaths.deals({ date: relevantId, id: imageId })
                    break;
                }
                default: {
                    return next(new APIInternalServerError(`Image path not configured for '${imageType}'.`));
                }
            }
            
            imageResponse = await imageDataURI.outputFile(image, imagePath);
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
            type: imageType,
            timestamp: timestamp,
        })
        await myDataSource.getRepository(Images).save(newImage);
        newImages.push(newImage);
    }
    return res.send(newImages);
})
router.delete('/images/:imageType/:relevantId', authHandler, async (req, res, next) => {
    const relevantId = req.params.relevantId;
    const imageType = req.params.imageType as ImageType;
    if(!ACCEPTED_IMAGE_TYPES.includes(imageType)) {
        return next(new APIBadRequestError('Invalid image type.'));
    }

    const imageIds = req.body.imageIds;
    if(!imageIds) return next(new APIBadRequestError('imageIds is required.'));
    if(!Array.isArray(imageIds)) return next(new APIBadRequestError('imageIds must be an array.'));
    
    let parent: Inspiration | Events | WeeklyDeal;
    if(imageType === IMAGE_TYPES.deals) {
        if(!isDealDate(relevantId)) {
            return next(new APIBadRequestError('Date is not a deal date.'));
        }
    } else {
        parent = await myDataSource.getRepository(getParentRepository(imageType)).findOneBy({ id: relevantId });
        if(!parent) {
            return next(new APINotFoundError('Parent not found'));
        }
    }

    for(const imageId of imageIds) {
        const image = await myDataSource.getRepository(Images).findOneBy({ id: imageId });
        if(!image) {
            console.warn(`Image with id ${imageId} not found.`);
            continue;
        }

        await myDataSource.getRepository(Images).delete(image);

        let imagePath = '';
        switch(imageType) {
            case IMAGE_TYPES.events: {
                imagePath = imagePaths.events({ imageId, timestamp: parent.timestamp, eventId: parent.id });
                break;
            }
            case IMAGE_TYPES.inspiration: {
                imagePath = imagePaths.inspiration({ parentId: parent.id, imageId });
                break;
            }
            case IMAGE_TYPES.deals: {
                imagePath = imagePaths.deals({ date: relevantId, id: imageId });
                break;
            }
            default: {
                return next(new APIInternalServerError(`Image path not configured for '${imageType}'.`));
            }
        }

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
})
router.patch('/images/:imageType/:relevantId', authHandler, async (req, res, next) => {
    const relevantId = req.params.relevantId;
    const imageType = req.params.imageType as ImageType;
    if(!ACCEPTED_IMAGE_TYPES.includes(imageType)) {
        return next(new APIBadRequestError('Invalid image type.'));
    }

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

    for(const pos of positions) {
        await myDataSource.getRepository(Images).update(
            { id: pos.id },
            { position: pos.position },
        )
    }

    const newImages = await myDataSource.getRepository(Images)
        .createQueryBuilder('images')
        .where('images.parentId = :parentId AND type = :type', { parentId: relevantId, type: imageType })
        .orderBy('images.position', 'ASC')
        .getMany();

    return res.send(newImages);
})

export default router;