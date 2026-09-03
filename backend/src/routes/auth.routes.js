/*
import express from 'express';
import { protect, authorize } from '../middlewares/auth.middleware.js';
import { getAdminData } from '../controllers/admin.controller.js'; // Example controller

const router = express.Router();

// This route is protected and only accessible by users with the 'admin' role.
router.get('/dashboard', protect, authorize('admin'), getAdminData);

export default router;
*/

import express from 'express';
import { register, login, logout, changePassword } from '../controllers/auth.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// router.post('/register', protect, register);  // Only logged-in user (admin) can register others
router.post('/login', login);

// Logout route. Koi bhi logged in user isay access kar sakta hai (protect lagana zaroori hai)
router.get('/logout', protect, logout); // Protect lagana zaroori hai.

// // This route is protected and only accessible by users with the 'admin' role.
// router.get('/dashboard', protect, authorize('admin'));

// === NEW ROUTE ===
router.put('/change-password', protect, changePassword);   // or router.post()

export default router;