import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { registerStudent, fetchAllStudents, fetchStudentByRollNo, fetchStudentsByClass, updateStudent } from '../controllers/reception.controller.js';   
// import { collectFee } from '../controllers/fees.controller.js';

// Example: import { createStudentProfile, collectFee, handleInquiry } from '../controllers/reception.controller.js';

const router = express.Router();

// Apply protect and authorize middleware to all routes in this file
router.use(protect, authorize('receptionist'));


// router.post('/admissions', );

// reception.routes.js

// /api/reception/

router.post('/az-students/admissions/register-student', registerStudent);

router.get('/az-students/fetch-all-students', fetchAllStudents);

router.get('/az-students/fetch-student-by-rollno/:rollNo', fetchStudentByRollNo);

router.get('/az-students/fetch-students-by-class/:className', fetchStudentsByClass);

router.put('/az-students/update-student/:rollNo', updateStudent);

// router.delete('/az-students/delete-student/:rollNo', authorize('admin'), deleteStudent);  // ***Reception has no authurity for this ***





router.get('/students', (req, res) => res.json({ success: true, message: 'Student search endpoint' }));

export default router;