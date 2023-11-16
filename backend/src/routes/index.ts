import * as express from 'express';
import { logError, returnError } from '../middleware/errorHandler';
import weeklyDeals from './weekly-deals';

const router = express.Router();

router.use('', weeklyDeals);

router.use(logError);
router.use(returnError);

export default router;