import express from 'express';
import health from './health';
import { authHandler } from './auth';
import newTopic from './topics/new-topic';
import getTopics from './topics/get-topics';
import newShortner from './short/new-short';
import redirectToLonUrl from './short/redirect';
import overall from './analytics/overall';
import urlAnalytics from './analytics/url';

const router = express.Router();

router.get('/health', health);
router.post('/auth',authHandler)

//topics
router.post('/topics',newTopic)
router.get('/topics',getTopics)

// shortner

router.post('/shorten', newShortner)
router.get('/shorten/:shortUrl', redirectToLonUrl)

//analytics

router.get('/analytics/overall', overall)
router.get('/analytics/:alias', urlAnalytics)
export default router;