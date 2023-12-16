import * as express from 'express';
import { myDataSource } from '../app-data-source';
import { Banners } from '../entity/banners.entity';
import { APIBadRequestError } from '../errors/apiBadRequestError';
import { createId } from '../utils';
import { APINotFoundError } from '../errors/apiNotFoundError';
import { authHandler } from '../middleware/authHandler';

const router = express.Router();

router.get('/banner', async (req, res, next) => {
    const banner = await myDataSource.getRepository(Banners).findOneBy({ active: true });
    res.send(banner || {});
})
router.get('/banners', authHandler, async (req, res, next) => {
    const banners = await myDataSource.getRepository(Banners).find();
    res.send(banners);
})
router.post('/banners', authHandler, async (req, res, next) => {
    const text = req.body.text;
    if(!text) return next(new APIBadRequestError('Text is a required property.'));

    const id = await createId('banners');

    const banner = myDataSource.getRepository(Banners).create({
        id,
        text,
        createdAt: Date.now().toString(),
    })
    await myDataSource.getRepository(Banners).save(banner);

    res.send(banner);
})
router.delete('/banners/:bannerId', authHandler, async (req, res, next) => {
    const banner = await myDataSource.getRepository(Banners).findOneBy({ id: req.params.bannerId });
    if(!banner) return next(new APINotFoundError('Banner not found.'));

    await myDataSource.getRepository(Banners).remove(banner);

    res.send({});
})
router.patch('/banners/:bannerId', authHandler, async (req, res, next) => {
    if(typeof req.body.text === 'string' && !req.body.text) {
        next(new APIBadRequestError('Text is required.'));
        return;
    }
    if(req.body.active !== undefined && ![true, false].includes(req.body.active)) {
        next(new APIBadRequestError('Active property must be a boolean.'));
        return;
    }

    const banner = await myDataSource.getRepository(Banners).findOneBy({ id: req.params.bannerId });
    if(!banner) return next(new APINotFoundError('Banner not found.'));

    const changes: {[prop: string]: any} = {};
    if(req.body.text !== undefined) changes.text = req.body.text;
    if(req.body.active !== undefined) changes.active = req.body.active;

    if(changes.active) {
        const alreadyActiveBanner = await myDataSource.getRepository(Banners).findOneBy({ active: true });
        if(alreadyActiveBanner) {
            await myDataSource.getRepository(Banners).save({
                ...alreadyActiveBanner,
                active: false,
            })
        }
    }

    const newBanner = await myDataSource.getRepository(Banners).save({
        ...banner,
        ...changes,
    })

    res.send(newBanner);
})

export default router;