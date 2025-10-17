import express from 'express';
import { getStatisticsSummaries, getLocationStatistics } from '../controllers/statistics.controller.js';

const router = express.Router();

router.get('/summaries', getStatisticsSummaries);
router.get('/location/:locationId', getLocationStatistics);

export default router;
