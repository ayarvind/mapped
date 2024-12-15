import express from 'express';
import health from './health';
import { authHandler } from './auth';

const router = express.Router();

router.get('/health', health);
router.post('/auth',authHandler)


export default router;