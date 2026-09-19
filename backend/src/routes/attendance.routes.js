import express from 'express'
// import { authorize, protect } from './middleware/auth.middleware.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { markAttendance } from '../controllers/attendance.controller.js';


const router = express.Router();

router.use(protect, authorize("receptionist"));


// router.post('/', protect, restrictTo('teacher', 'admin'), restrictToOwnClass, markAttendance);
// router.get('/class/:className', protect, restrictTo('teacher', 'admin', 'receptionist'), restrictToOwnClass, getClassAttendance);
// router.get('/me', protect, restrictTo('student'), getMyAttendance);


// /api/reception/attendance


router.post('/markAttendance', markAttendance)
// Check FINE 



export default router;