import * as express from 'express';
import { logError, returnError } from '../middleware/errorHandler';
import weeklyDeals from './weekly-deals';
import events from './events';

const router = express.Router();

router.use('', weeklyDeals);
router.use('', events);

router.use(logError);
router.use(returnError);

export default router;