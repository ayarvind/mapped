import express from 'express';
import health from './health';
import { authHandler } from './auth';
import newTopic from './topics/new-topic';
import getTopics from './topics/get-topics';
import newShortner from './short/new-short';

const router = express.Router();

router.get('/health', health);
router.post('/auth',authHandler)

//topics
router.post('/topics',newTopic)
router.get('/topics',getTopics)

// shortner

router.post('/short', newShortner)



export default router;