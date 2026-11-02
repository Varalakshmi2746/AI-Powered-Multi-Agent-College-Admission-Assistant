import express from 'express';
import { compareColleges } from '../controllers/comparisonController.js';

const router = express.Router();

router.post('/', compareColleges);

export default router;
