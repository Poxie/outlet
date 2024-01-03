import * as express from 'express';
import { logError, returnError } from '../middleware/errorHandler';
import weeklyDeals from './weekly-deals';
import events from './events';
import stores from './stores';
import banners from './banners';
import inspiration from './inspiration';
import categories from './categories';
import images from './images';
import people from './people';
import login from './login';

const router = express.Router();

router.use('', weeklyDeals);
router.use('', events);
router.use('', stores);
router.use('', banners);
router.use('', inspiration);
router.use('', categories);
router.use('', images);
router.use('', people);
router.use('', login);

router.use(logError);
router.use(returnError);

export default router;