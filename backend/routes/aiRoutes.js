import express from 'express';
import { getAIRecommendations, chatWithAgents } from '../controllers/aiBridgeController.js';

const router = express.Router();

router.post('/recommend', getAIRecommendations);
router.post('/chat', chatWithAgents);

export default router;
