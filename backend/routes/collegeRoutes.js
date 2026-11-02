import express from 'express';
import {
  getAllColleges,
  getCollegeById,
  createCollege,
  updateCollege,
  deleteCollege,
} from '../controllers/collegeController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllColleges);
router.get('/:id', getCollegeById);
router.post('/', protect, adminOnly, createCollege);
router.put('/:id', protect, adminOnly, updateCollege);
router.delete('/:id', protect, adminOnly, deleteCollege);

export default router;
