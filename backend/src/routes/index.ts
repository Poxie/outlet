import * as express from 'express';
import { logError, returnError } from '../middleware/errorHandler';
import weeklyDeals from './weekly-deals';
import events from './events';
import stores from './stores';
import banners from './banners';
import inspiration from './inspiration';

const router = express.Router();

router.use('', weeklyDeals);
router.use('', events);
router.use('', stores);
router.use('', banners);
router.use('', inspiration);

router.use(logError);
router.use(returnError);

export default router;