import express from 'express';
import { analyzeFees } from '../controllers/feeController.js';

const router = express.Router();

router.get('/analyze', analyzeFees);

export default router;
