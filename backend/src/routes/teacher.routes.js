// import express from 'express';
// import { protect, authorize } from '../middleware/auth.middleware.js';
// import { getStudentsByClass } from '../controllers/teacher.controller.js';

// // Import your teacher controllers here
// // Example: import { getMyProfile, updateMyProfile, markAttendance } from '../controllers/teacher.controller.js';

// const router = express.Router();

// // Apply protect and authorize middleware to all routes in this file
// router.use(protect, authorize('teacher'));

// // Search all students by class
// router.get('/students/:className', getStudentsByClass);


// /**
//  * POST /api/teacher/results
//  * Upload student results image
//  */
// router.post('/results', (req, res) => res.json({ success: true, message: 'Results uploaded successfully' }));

// export default router;

import express from 'express';
import multer from 'multer';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { uploadResultImage, getAllResults, getStudentsByClass, uploadNotes, deleteResultImage } from '../controllers/teacher.controller.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // temporary folder

router.use(protect);

// Teacher only routes
router.post('/upload-result', authorize('teacher'), upload.single('image'), uploadResultImage);

// New added | add this in frontend
router.delete('/delete-result/:pubId', authorize('teacher'), deleteResultImage);

router.post('/upload-notes', authorize('teacher'), upload.single('file'), uploadNotes)

router.get('/all-results', authorize('teacher', 'admin'), getAllResults);

router.get('/students/:className', authorize('teacher'), getStudentsByClass);

export default router;