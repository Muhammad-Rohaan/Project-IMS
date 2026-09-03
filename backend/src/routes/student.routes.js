import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { getFeeStatus, getMyClassResults, getNotes } from '../controllers/student.controller.js';

// Import your student controllers here
// Example: import { getMyProfile, getMyAttendance, getMyResults } from '../controllers/student.controller.js';

const router = express.Router();

// Apply protect and authorize middleware to all routes in this file
router.use(protect, authorize('student'));


router.get('/profile', (req, res) => res.json({ success: true, user: req.user }));

router.get('/fees', getFeeStatus);

router.get('/fetchNotes', getNotes);

router.get('/my-class-results', getMyClassResults);

export default router;