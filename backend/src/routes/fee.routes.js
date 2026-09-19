// routes/fee.routes.js
import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import {
    collectFee,
    getAllPendingFees,
    getAllUnpaidFees,
    getStudentFeeStatus,
    getStudentsFeeData,
    changeFeeStatusToUnpaid
} from '../controllers/fees.controller.js';

const router = express.Router();

router.use(protect, authorize('receptionist'));  // check

// router.post('/create-voucher', createFeeVoucher);
router.post('/collect', collectFee);
router.get('/student/:rollNo', getStudentFeeStatus);
router.get('/unpaid', getAllUnpaidFees);
// router.get('/pending', getAllPendingFees);
router.get('/all-students', getStudentsFeeData);
router.post('/generate-unpaid', changeFeeStatusToUnpaid);
router.post('/fee-status-unpaid', changeFeeStatusToUnpaid);

export default router;