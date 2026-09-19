import React, { useEffect, useState, useCallback } from 'react';
import {
    BanknotesIcon,
    ArrowDownTrayIcon,
    PlusIcon,
    TrashIcon,
    PencilIcon,
    CalendarDaysIcon,
    BoltIcon,
    BuildingOfficeIcon,
    WalletIcon,
    TicketIcon,
    ClipboardDocumentListIcon,
    ArrowUpOnSquareIcon,
    ArrowDownOnSquareIcon,
    AcademicCapIcon
} from '@heroicons/react/24/solid';
import { getFinanceSummary, getExpenses, addExpense, deleteExpense, updateExpense, getExpenseCategories } from '../../api/admin.js';
import toast from 'react-hot-toast';

/* ============ MONTH/YEAR OPTIONS ============ */
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const YEARS = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

/* ============ CATEGORY COLORS ============ */
const CATEGORY_COLORS = {
    'Teacher Salary': 'from-blue-600 to-blue-400',
    'Receptionist Salary': 'from-purple-600 to-purple-400',
    'Rent': 'from-orange-600 to-orange-400',
    'Utility Bill': 'from-yellow-600 to-yellow-400',
    'Other Bill': 'from-pink-600 to-pink-400',
    'Other Cost': 'from-gray-600 to-gray-400'
};

const CATEGORY_ICONS = {
    'Teacher Salary': '👨‍🏫',
    'Receptionist Salary': '👩‍💼',
    'Rent': '🏠',
    'Utility Bill': '⚡',
    'Other Bill': '📋',
    'Other Cost': '💰'
};

/* ============ STAT CARD ============ */
const StatCard = ({ title, value, icon: Icon, gradient, subtitle }) => (
    <div className={`group relative p-5 rounded-2xl shadow-xl backdrop-blur-md border border-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${gradient}`} aria-label={`${title}: ${value}`}>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium opacity-70">{title}</p>
                <p className="text-3xl font-extrabold mt-1 text-white">{value}</p>
                {subtitle && <p className="text-xs opacity-50 mt-1">{subtitle}</p>}
            </div>
            <div className="bg-white/15 p-3 rounded-xl group-hover:bg-white/25 transition-colors" aria-hidden="true">
                <Icon className="h-6 w-6 text-white" />
            </div>
        </div>
    </div>
);

/* ============ BAR CHART COMPONENT ============ */
const BarChart = ({ data, maxLabel }) => {
    const max = Math.max(...Object.values(data), 1);
    return (
        <div className="space-y-3" role="img" aria-label={maxLabel}>
            {Object.entries(data).map(([key, value]) => (
                <div key={key} className="flex items-center gap-3">
                    <span className="text-xs text-blue-200 w-36 truncate">{key}</span>
                    <div className="flex-1 h-6 bg-white/5 rounded-lg overflow-hidden">
                        <div
                            className={`h-full bg-gradient-to-r ${CATEGORY_COLORS[key] || 'from-gray-600 to-gray-400'} rounded-lg transition-all duration-700 ease-out`}
                            style={{ width: `${(value / max) * 100}%` }}
                        />
                    </div>
                    <span className="text-xs font-semibold text-white w-16 text-right">{value?.toLocaleString() || 0}</span>
                </div>
            ))}
        </div>
    );
};

/* ============ ADD EXPENSE MODAL ============ */
const AddExpenseModal = ({ onClose, onAdd }) => {
    const [form, setForm] = useState({
        title: '',
        category: 'Other Cost',
        amount: '',
        description: '',
        paymentMethod: 'Cash',
        notes: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title || !form.amount) {
            toast.error('Title and Amount are required');
            return;
        }
        setSubmitting(true);
        try {
            const res = await addExpense({ ...form, amount: Number(form.amount) });
            toast.success('Expense added successfully!');
            onAdd(res.data);
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add expense');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-label="Add Expense">
            <div className="bg-blue-950 border border-blue-400/30 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                <h3 className="text-xl font-extrabold bg-gradient-to-r from-blue-400 to-sky-500 bg-clip-text text-transparent mb-4">
                    Add New Expense
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-blue-200 mb-1">Title *</label>
                        <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-blue-950/80 border border-blue-400/30 text-white focus:outline-none focus:border-sky-400" placeholder="e.g., Office Rent" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-blue-200 mb-1">Category</label>
                            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-blue-950/80 border border-blue-400/30 text-white focus:outline-none focus:border-sky-400">
                                {Object.keys(CATEGORY_ICONS).map(cat => (
                                    <option key={cat} value={cat}>{CATEGORY_ICONS[cat]} {cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-blue-200 mb-1">Amount (PKR) *</label>
                            <input type="number" required min="0" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-blue-950/80 border border-blue-400/30 text-white focus:outline-none focus:border-sky-400" placeholder="0" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-blue-200 mb-1">Payment Method</label>
                        <select value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-blue-950/80 border border-blue-400/30 text-white focus:outline-none focus:border-sky-400">
                            <option>Cash</option>
                            <option>Bank Transfer</option>
                            <option>Cheque</option>
                            <option>Online</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-blue-200 mb-1">Description</label>
                        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-blue-950/80 border border-blue-400/30 text-white focus:outline-none focus:border-sky-400" rows={2} placeholder="Optional description..." />
                    </div>
                    <div>
                        <label className="block text-sm text-blue-200 mb-1">Notes</label>
                        <input type="text" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-blue-950/80 border border-blue-400/30 text-white focus:outline-none focus:border-sky-400" placeholder="Transaction ref, etc." />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={submitting}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-sky-500 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-sky-600 transition disabled:opacity-50">
                            {submitting ? 'Adding...' : 'Add Expense'}
                        </button>
                        <button type="button" onClick={onClose}
                            className="px-6 py-3 bg-blue-800/50 text-blue-200 rounded-xl font-medium hover:bg-blue-800 transition">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ============ EDIT EXPENSE MODAL ============ */
const EditExpenseModal = ({ expense, onClose, onUpdate }) => {
    const [form, setForm] = useState({
        title: expense.title,
        category: expense.category,
        amount: expense.amount,
        description: expense.description || '',
        paymentMethod: expense.paymentMethod,
        notes: expense.notes || ''
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await updateExpense(expense._id, { ...form, amount: Number(form.amount) });
            toast.success('Expense updated!');
            onUpdate(res.data);
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-label="Edit Expense">
            <div className="bg-blue-950 border border-blue-400/30 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                <h3 className="text-xl font-extrabold bg-gradient-to-r from-blue-400 to-sky-500 bg-clip-text text-transparent mb-4">
                    Edit Expense
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-blue-200 mb-1">Title *</label>
                        <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-blue-950/80 border border-blue-400/30 text-white focus:outline-none focus:border-sky-400" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-blue-200 mb-1">Category</label>
                            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-blue-950/80 border border-blue-400/30 text-white focus:outline-none focus:border-sky-400">
                                {Object.keys(CATEGORY_ICONS).map(cat => (
                                    <option key={cat} value={cat}>{CATEGORY_ICONS[cat]} {cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-blue-200 mb-1">Amount (PKR)</label>
                            <input type="number" required min="0" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-blue-950/80 border border-blue-400/30 text-white focus:outline-none focus:border-sky-400" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-blue-200 mb-1">Payment Method</label>
                        <select value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-blue-950/80 border border-blue-400/30 text-white focus:outline-none focus:border-sky-400">
                            <option>Cash</option>
                            <option>Bank Transfer</option>
                            <option>Cheque</option>
                            <option>Online</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-blue-200 mb-1">Description</label>
                        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-blue-950/80 border border-blue-400/30 text-white focus:outline-none focus:border-sky-400" rows={2} />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={submitting}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-sky-500 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-sky-600 transition disabled:opacity-50">
                            {submitting ? 'Updating...' : 'Update'}
                        </button>
                        <button type="button" onClick={onClose}
                            className="px-6 py-3 bg-blue-800/50 text-blue-200 rounded-xl font-medium hover:bg-blue-800 transition">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ============ CONFIRM DELETE MODAL ============ */
const ConfirmDeleteModal = ({ expense, onConfirm, onClose }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-label="Confirm Delete">
        <div className="bg-blue-950 border border-red-400/30 rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <div className="bg-red-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrashIcon className="h-8 w-8 text-red-400" />
            </div>
            <h3 className="text-xl font-extrabold text-white mb-2">Delete Expense?</h3>
            <p className="text-blue-200 mb-1">Are you sure you want to delete:</p>
            <p className="text-red-400 font-semibold">{expense?.title}</p>
            <p className="text-sm text-blue-300 mt-1">PKR {expense?.amount?.toLocaleString()}</p>
            <div className="flex gap-3 mt-6">
                <button onClick={() => onConfirm()} className="flex-1 bg-gradient-to-r from-red-600 to-red-500 text-white py-3 rounded-xl font-semibold hover:from-red-700 hover:to-red-600 transition">
                    Yes, Delete
                </button>
                <button onClick={onClose} className="flex-1 bg-blue-800/50 text-blue-200 py-3 rounded-xl font-medium hover:bg-blue-800 transition">
                    Cancel
                </button>
            </div>
        </div>
    </div>
);

/* ============ MAIN FINANCE PAGE ============ */
const FinancePage = () => {
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [expenseCategories, setExpenseCategories] = useState([]);

    // Filter state
    const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('en-US', { month: 'long' }));
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // UI state
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [editingExpense, setEditingExpense] = useState(null);

    // Fetch data
    const fetchAllData = useCallback(async () => {
        setLoading(true);
        try {
            const [summaryRes, expensesRes, categoriesRes] = await Promise.all([
                getFinanceSummary(selectedMonth, selectedYear),
                getExpenses(selectedMonth, selectedYear),
                getExpenseCategories()
            ]);
            setSummary(summaryRes.data?.data || null);
            setExpenses(expensesRes.data?.data || []);
            setExpenseCategories(categoriesRes.data?.data || []);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to load finance data');
        } finally {
            setLoading(false);
        }
    }, [selectedMonth, selectedYear]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    // Handlers
    const handleAddExpense = async (newExpense) => {
        try {
            setExpenses(prev => [...prev, newExpense]);
            await fetchAllData();
        } catch (err) {
            toast.error('Failed to refresh data');
        }
    };

    const handleUpdateExpense = async (updatedExpense) => {
        try {
            setExpenses(prev => prev.map(e => e._id === updatedExpense._id ? updatedExpense : e));
            await fetchAllData();
        } catch (err) {
            toast.error('Failed to refresh data');
        }
    };

    const handleDeleteExpense = async () => {
        try {
            await deleteExpense(selectedExpense._id);
            setExpenses(prev => prev.filter(e => e._id !== selectedExpense._id));
            toast.success('Expense deleted!');
            setShowDeleteModal(false);
            await fetchAllData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete');
        }
    };

    // Compute expense breakdown from expense data
    const expenseBreakdown = expenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
    }, {});

    // Salary breakdown
    const teacherSalary = expenses.filter(e => e.category === 'Teacher Salary').reduce((s, e) => s + e.amount, 0) || summary?.teacherSalaryTotal || 0;
    const receptionistSalary = expenses.filter(e => e.category === 'Receptionist Salary').reduce((s, e) => s + e.amount, 0) || summary?.receptionistSalaryTotal || 0;
    const totalSalaries = teacherSalary + receptionistSalary;

    // Bill breakdown
    const rent = expenseBreakdown['Rent'] || 0;
    const utilities = expenseBreakdown['Utility Bill'] || 0;
    const otherBills = (expenseBreakdown['Other Bill'] || 0);
    const otherCosts = (expenseBreakdown['Other Cost'] || 0);

    // Display values
    const totalFees = summary?.totalFeesCollected || 0;
    const totalRevenue = summary?.totalRevenue || totalFees;
    const totalExpenses = summary?.totalExpenses || (totalSalaries + rent + utilities + otherBills + otherCosts);
    const netProfit = totalRevenue - totalExpenses;

    return (
        <main className="space-y-8" aria-labelledby="finance-title">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 id="finance-title" className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-sky-500 to-pink-500 bg-clip-text text-transparent">
                        Finance Dashboard
                    </h1>
                    <p className="text-blue-300 mt-1">Track revenue, expenses, salaries, and profitability</p>
                </div>

                {/* Month/Year Selector */}
                <div className="flex items-center gap-3 bg-blue-950/50 backdrop-blur-md border border-blue-400/30 rounded-xl p-2" role="group" aria-label="Select month and year">
                    <CalendarDaysIcon className="h-5 w-5 text-sky-400 flex-shrink-0" aria-hidden="true" />
                    <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}
                        className="bg-transparent text-white text-sm font-medium focus:outline-none cursor-pointer border-r border-blue-700/50 pr-3" aria-label="Select month">
                        {MONTHS.map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                    <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}
                        className="bg-transparent text-white text-sm font-medium focus:outline-none cursor-pointer" aria-label="Select year">
                        {YEARS.map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading && !summary ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-live="polite">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-32 bg-blue-950/50 rounded-2xl animate-pulse border border-blue-400/20" />
                    ))}
                </div>
            ) : (
                <>
                    {/* ====== KPI STAT CARDS ====== */}
                    <section aria-label="Key Performance Indicators" className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <StatCard title="Total Fees Collected" value={`PKR ${totalFees.toLocaleString()}`} icon={BanknotesIcon} gradient="bg-gradient-to-br from-emerald-800/80 to-emerald-900/60" subtitle="From student fees this month" />
                        <StatCard title="Total Revenue" value={`PKR ${totalRevenue.toLocaleString()}`} icon={WalletIcon} gradient="bg-gradient-to-br from-sky-800/80 to-sky-900/60" subtitle="All revenue sources" />
                        <StatCard title="Total Expenses" value={`PKR ${totalExpenses.toLocaleString()}`} icon={ArrowDownTrayIcon} gradient="bg-gradient-to-br from-orange-800/80 to-orange-900/60" subtitle="All costs combined" />
                        <StatCard title="Net Profit" value={`PKR ${netProfit.toLocaleString()}`} icon={ArrowUpOnSquareIcon} gradient={netProfit >= 0 ? 'bg-gradient-to-br from-green-800/80 to-green-900/60' : 'bg-gradient-to-br from-red-800/80 to-red-900/60'} subtitle="Revenue minus expenses" />
                        <StatCard title="Teachers Salaries" value={`PKR ${teacherSalary.toLocaleString()}`} icon={AcademicCapIcon} gradient="bg-gradient-to-br from-blue-800/80 to-blue-900/60" subtitle="Teacher payroll" />
                        <StatCard title="Receptionist Salaries" value={`PKR ${receptionistSalary.toLocaleString()}`} icon={BuildingOfficeIcon} gradient="bg-gradient-to-br from-purple-800/80 to-purple-900/60" subtitle="Reception payroll" />
                    </section>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* ====== EXPENSES BREAKDOWN ====== */}
                        <section className="bg-blue-950/50 backdrop-blur-md rounded-2xl border border-blue-400/30 p-6" aria-label="Expenses Breakdown">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-sky-500 bg-clip-text text-transparent">
                                    Expenses Breakdown
                                </h2>
                                <span className="text-xs bg-blue-800/50 text-blue-200 px-3 py-1 rounded-full">{selectedMonth} {selectedYear}</span>
                            </div>

                            {/* Visual Bar Chart */}
                            <BarChart
                                data={{
                                    'Teacher Salary': teacherSalary,
                                    'Receptionist Salary': receptionistSalary,
                                    'Rent': rent,
                                    'Utility Bill': utilities,
                                    'Other Bill': otherBills,
                                    'Other Cost': otherCosts
                                }}
                                maxLabel={`Expenses for ${selectedMonth} ${selectedYear}`}
                            />

                            {/* Quick Stats */}
                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <div className="bg-blue-900/40 rounded-xl p-4 text-center">
                                    <p className="text-xs text-blue-300 mb-1">Total Salaries</p>
                                    <p className="text-xl font-extrabold text-white">PKR {totalSalaries.toLocaleString()}</p>
                                </div>
                                <div className="bg-blue-900/40 rounded-xl p-4 text-center">
                                    <p className="text-xs text-blue-300 mb-1">Total Bills</p>
                                    <p className="text-xl font-extrabold text-white">PKR {(rent + utilities + otherBills).toLocaleString()}</p>
                                </div>
                            </div>
                        </section>

                        {/* ====== EXPENSE TRACKER ====== */}
                        <section className="bg-blue-950/50 backdrop-blur-md rounded-2xl border border-blue-400/30 p-6" aria-label="Expense Tracker">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-sky-500 bg-clip-text text-transparent">
                                    Expense Tracker
                                </h2>
                                <button onClick={() => setShowAddModal(true)}
                                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-sky-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-sky-600 transition shadow-lg shadow-blue-500/30"
                                    aria-label="Add new expense">
                                    <PlusIcon className="h-4 w-4" aria-hidden="true" />
                                    Add Expense
                                </button>
                            </div>

                            {/* Expense list */}
                            <div className="space-y-3 max-h-80 overflow-y-auto pr-2" role="list" aria-label="Expense items">
                                {expenses.length === 0 ? (
                                    <div className="text-center py-8 text-blue-400">
                                        <ClipboardDocumentListIcon className="h-12 w-12 mx-auto mb-3 opacity-50" aria-hidden="true" />
                                        <p className="text-sm">No expenses recorded for this month</p>
                                        <p className="text-xs mt-1">Click "Add Expense" to get started</p>
                                    </div>
                                ) : (
                                    expenses.map(exp => (
                                        <div key={exp._id} className="flex items-center justify-between p-4 rounded-xl bg-blue-900/40 hover:bg-blue-900/60 transition group" role="listitem">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${CATEGORY_COLORS[exp.category] || 'from-gray-600 to-gray-400'} flex items-center justify-center text-lg flex-shrink-0`} aria-hidden="true">
                                                    {CATEGORY_ICONS[exp.category] || '💰'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-white">{exp.title}</p>
                                                    <p className="text-xs text-blue-300">{exp.category} • {exp.paymentMethod}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-emerald-400">PKR {exp.amount.toLocaleString()}</span>
                                                <button onClick={() => { setSelectedExpense(exp); setEditingExpense(exp); setShowEditModal(true); }}
                                                    className="p-1.5 rounded-lg bg-blue-800/50 text-blue-300 hover:text-white hover:bg-blue-700/50 opacity-0 group-hover:opacity-100 transition" aria-label={`Edit ${exp.title}`}>
                                                    <PencilIcon className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => { setSelectedExpense(exp); setShowDeleteModal(true); }}
                                                    className="p-1.5 rounded-lg bg-blue-800/50 text-red-400 hover:text-white hover:bg-blue-700/50 opacity-0 group-hover:opacity-100 transition" aria-label={`Delete ${exp.title}`}>
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Total for month */}
                            {expenses.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-blue-700/30 flex items-center justify-between">
                                    <span className="text-blue-300 font-medium">Total Expenses This Month</span>
                                    <span className="text-xl font-extrabold text-white">PKR {expenses.reduce((s, e) => s + e.amount, 0).toLocaleString()}</span>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* ====== PROFIT DASHBOARD ====== */}
                    <section className="bg-blue-950/50 backdrop-blur-md rounded-2xl border border-blue-400/30 p-6" aria-label="Profit Analysis">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30" aria-hidden="true">
                                <TicketIcon className="h-6 w-6 text-white" />
                            </div>
                            <h2 className="text-2xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                                Profit Analysis
                            </h2>
                        </div>

                        {/* Profit indicator */}
                        <div className={`rounded-2xl p-6 text-center border ${netProfit >= 0 ? 'bg-green-900/30 border-green-500/30' : 'bg-red-900/30 border-red-500/30'}`}>
                            <p className={`text-sm font-medium mb-1 ${netProfit >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                                {netProfit >= 0 ? '✅ Profitable This Month' : '❌ Loss This Month'}
                            </p>
                            <p className={`text-5xl font-extrabold ${netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {netProfit >= 0 ? '+' : '-'}PKR {Math.abs(netProfit).toLocaleString()}
                            </p>
                            <p className="text-blue-300 text-sm mt-2">
                                Revenue: PKR {totalRevenue.toLocaleString()} - Expenses: PKR {totalExpenses.toLocaleString()}
                            </p>
                        </div>

                        {/* Revenue vs Expense comparison */}
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-emerald-900/30 rounded-xl p-4 text-center border border-emerald-500/20">
                                <p className="text-xs text-emerald-300 mb-1">Revenue</p>
                                <p className="text-2xl font-extrabold text-emerald-400">PKR {totalRevenue.toLocaleString()}</p>
                            </div>
                            <div className="bg-orange-900/30 rounded-xl p-4 text-center border border-orange-500/20">
                                <p className="text-xs text-orange-300 mb-1">Expenses</p>
                                <p className="text-2xl font-extrabold text-orange-400">PKR {totalExpenses.toLocaleString()}</p>
                            </div>
                            <div className={`rounded-xl p-4 text-center border ${netProfit >= 0 ? 'bg-green-900/30 border-green-500/20' : 'bg-red-900/30 border-red-500/20'}`}>
                                <p className="text-xs text-blue-300 mb-1">Net</p>
                                <p className={`text-2xl font-extrabold ${netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {netProfit >= 0 ? '+' : '-'}PKR {Math.abs(netProfit).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </section>
                </>
            )}

            {/* Modals */}
            {showAddModal && <AddExpenseModal onClose={() => setShowAddModal(false)} onAdd={handleAddExpense} />}
            {showEditModal && <EditExpenseModal expense={editingExpense} onClose={() => setShowEditModal(false)} onUpdate={handleUpdateExpense} />}
            {showDeleteModal && <ConfirmDeleteModal expense={selectedExpense} onConfirm={handleDeleteExpense} onClose={() => setShowDeleteModal(false)} />}
        </main>
    );
};

export default FinancePage;
