import * as express from 'express';
import { myDataSource } from '../app-data-source';
import { Banners } from '../entity/banners.entity';
import { APIBadRequestError } from '../errors/apiBadRequestError';
import { createId } from '../utils';
import { APINotFoundError } from '../errors/apiNotFoundError';

const router = express.Router();

router.get('/banners', async (req, res, next) => {
    const banners = await myDataSource.getRepository(Banners).find();
    res.send(banners);
})
router.post('/banners', async (req, res, next) => {
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
router.delete('/banners/:bannerId', async (req, res, next) => {
    const banner = await myDataSource.getRepository(Banners).findOneBy({ id: req.params.bannerId });
    if(!banner) return next(new APINotFoundError('Banner not found.'));

    await myDataSource.getRepository(Banners).remove(banner);

    res.send({});
})

export default router;