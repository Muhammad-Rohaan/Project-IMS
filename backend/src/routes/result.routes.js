// import express from 'express';
// import { protect } from '../middleware/auth.middleware.js';
// import { restrictTo } from '../middleware/role.middleware.js';
// import { restrictToOwnClass } from '../middleware/restrictToOwnClass.middleware.js';
// import {
//     uploadResultImage,
//     getResultsByClass,
//     deleteResult,
// } from '../controllers/result.controller.js';

// const router = express.Router();

// // Upload - Sirf teacher/admin + apni class
// router.post('/upload',
//     protect,
//     restrictTo('teacher', 'admin'),
//     restrictToOwnClass,
//     uploadResultImage
// );

// // Dekhna - Koi bhi apni class ka dekh sake
// router.get('/class/:className', protect, getResultsByClass);

// // Delete - sirf jisne upload kiya ya admin
// router.delete('/:id', protect, restrictTo('teacher', 'admin'), deleteResult);

// export default router;