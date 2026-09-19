import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import {
    getFinanceSummary,
    getAllFinanceRecords,
    getExpenses,
    addExpense,
    deleteExpense,
    updateExpense,
    getExpenseSummary,
    getExpenseCategories,
    getFinanceOverview
} from '../controllers/finance.controller.js';

const router = express.Router();

// All finance routes are admin-only
router.use(protect, authorize('admin'));

// Finance dashboard summary for a specific month/year
router.get('/summary', getFinanceSummary);

// Finance overview for an entire year
router.get('/overview/:year', getFinanceOverview);

// All monthly finance records
router.get('/all', getAllFinanceRecords);

// Expense tracker endpoints
router.get('/expenses', getExpenses);
router.post('/expenses', addExpense);
router.put('/expenses/:id', updateExpense);
router.delete('/expenses/:id', deleteExpense);

// Expense category summary
router.get('/expense-summary', getExpenseSummary);
router.get('/expense-categories', getExpenseCategories);

export default router;
