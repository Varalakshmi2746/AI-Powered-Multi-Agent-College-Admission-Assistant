import express from 'express';
import {
  getMyApplications,
  applyOrShortlistCollege,
  updateApplicationStatus,
  deleteApplication,
} from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getMyApplications);
router.post('/', applyOrShortlistCollege);
router.put('/:id', updateApplicationStatus);
router.delete('/:id', deleteApplication);

export default router;
