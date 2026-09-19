import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/auth.middleware.js';
import {
    createAnnouncement,
    getAnnouncements,
    deleteAnnouncement
    // getSpecificClassAnnouncement
} from '../controllers/announcement.controller.js';

const router = express.Router();

router.post('/create-new-announcement', protect, authorize('admin', 'teacher', 'receptionist'), createAnnouncement);
router.get('/:className', protect, getAnnouncements);
router.delete('/:id', protect, authorize('admin', 'teacher', 'receptionist'), deleteAnnouncement);

export default router;