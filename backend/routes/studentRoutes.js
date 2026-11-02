import express from 'express';
import { getStudentProfile, updateStudentProfile, getAllStudents } from '../controllers/studentController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', protect, getStudentProfile);
router.put('/profile', protect, updateStudentProfile);
router.get('/all', protect, adminOnly, getAllStudents);

export default router;
