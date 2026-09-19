import axiosInstance from './axios.js';

/**
 * Finance API functions
 */

// Get finance summary for a specific month/year
export const getFinanceSummary = (month, year) =>
    axiosInstance.get('/admin/finance/summary', { params: { month, year } });

// Get finance overview for an entire year
export const getFinanceOverview = (year) =>
    axiosInstance.get(`/admin/finance/overview/${year}`);

// Get all monthly finance records
export const getAllFinanceRecords = (year) =>
    axiosInstance.get('/admin/finance/all', { params: { year } });

// Get expenses
export const getExpenses = (month, year, category) =>
    axiosInstance.get('/admin/finance/expenses', { params: { month, year, category } });

// Add expense
export const addExpense = (expenseData) =>
    axiosInstance.post('/admin/finance/expenses', expenseData);

// Update expense
export const updateExpense = (id, expenseData) =>
    axiosInstance.put(`/admin/finance/expenses/${id}`, expenseData);

// Delete expense
export const deleteExpense = (id) =>
    axiosInstance.delete(`/admin/finance/expenses/${id}`);

// Get expense category summary
export const getExpenseSummary = (month, year) =>
    axiosInstance.get('/admin/finance/expense-summary', { params: { month, year } });

// Get expense categories list
export const getExpenseCategories = () =>
    axiosInstance.get('/admin/finance/expense-categories');
