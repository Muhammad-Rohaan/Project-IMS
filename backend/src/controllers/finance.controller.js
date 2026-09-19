import Finance from "../models/Finance.model.js";
import Expense from "../models/Expense.model.js";
import Fee from "../models/Fee.model.js";
import TeacherProfile from "../models/TeacherProfile.model.js";
import ReceptionProfileModel from "../models/ReceptionProfile.model.js";

/**
 * @desc    Get finance dashboard summary for a specific month/year
 * @route   GET /api/admin/finance/summary
 * @access  Admin
 */
export const getFinanceSummary = async (req, res) => {
    try {
        const { month, year } = req.query;

        if (!month || !year) {
            return res.status(400).json({ message: "Month and year are required" });
        }

        let summary = await Finance.findOne({ month, year: Number(year) });

        // If summary doesn't exist, calculate it from raw data
        if (!summary) {
            summary = await calculateFinanceSummary(month, Number(year));
        }

        res.status(200).json({
            success: true,
            data: summary
        });
    } catch (error) {
        console.error("Get Finance Summary Error:", error);
        res.status(500).json({ message: "Error fetching finance summary", error: error.message });
    }
};

/**
 * @desc    Get all monthly finance records
 * @route   GET /api/admin/finance/all
 * @access  Admin
 */
export const getAllFinanceRecords = async (req, res) => {
    try {
        const { year } = req.query;
        const filter = year ? { year: Number(year) } : {};

        const records = await Finance.find(filter)
            .sort({ year: -1, month: 1 })
            .lean();

        res.status(200).json({
            success: true,
            count: records.length,
            data: records
        });
    } catch (error) {
        console.error("Get All Finance Records Error:", error);
        res.status(500).json({ message: "Error fetching finance records", error: error.message });
    }
};

/**
 * @desc    Get expense tracker data
 * @route   GET /api/admin/finance/expenses
 * @access  Admin
 */
export const getExpenses = async (req, res) => {
    try {
        const { month, year, category } = req.query;
        const filter = {};

        if (month) filter.month = month;
        if (year) filter.year = Number(year);
        if (category) filter.category = category;

        const expenses = await Expense.find(filter)
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: expenses.length,
            data: expenses
        });
    } catch (error) {
        console.error("Get Expenses Error:", error);
        res.status(500).json({ message: "Error fetching expenses", error: error.message });
    }
};

/**
 * @desc    Add a new expense
 * @route   POST /api/admin/finance/expenses
 * @access  Admin
 */
export const addExpense = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            amount,
            month,
            year,
            referenceId,
            referenceModel,
            referenceName,
            paidBy,
            paymentMethod,
            transactionRef,
            notes
        } = req.body;

        const expense = await Expense.create({
            title,
            description,
            category,
            amount,
            month,
            year: Number(year),
            referenceId,
            referenceModel,
            referenceName,
            paidBy: paidBy || req.user?.fullName || 'Admin',
            paymentMethod,
            transactionRef,
            notes
        });

        // Recalculate the finance summary for this month/year
        await recalculateFinanceSummary(month, Number(year));

        res.status(201).json({
            success: true,
            message: "Expense added successfully",
            data: expense
        });
    } catch (error) {
        console.error("Add Expense Error:", error);
        res.status(500).json({ message: "Error adding expense", error: error.message });
    }
};

/**
 * @desc    Delete an expense
 * @route   DELETE /api/admin/finance/expenses/:id
 * @access  Admin
 */
export const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const expense = await Expense.findByIdAndDelete(id);

        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        // Recalculate finance summary for the affected month/year
        await recalculateFinanceSummary(expense.month, expense.year);

        res.status(200).json({
            success: true,
            message: "Expense deleted successfully"
        });
    } catch (error) {
        console.error("Delete Expense Error:", error);
        res.status(500).json({ message: "Error deleting expense", error: error.message });
    }
};

/**
 * @desc    Update an expense
 * @route   PUT /api/admin/finance/expenses/:id
 * @access  Admin
 */
export const updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const { category, amount, title, description, notes } = req.body;

        const expense = await Expense.findByIdAndUpdate(
            id,
            { category, amount, title, description, notes },
            { new: true, runValidators: true }
        );

        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        await recalculateFinanceSummary(expense.month, expense.year);

        res.status(200).json({
            success: true,
            message: "Expense updated successfully",
            data: expense
        });
    } catch (error) {
        console.error("Update Expense Error:", error);
        res.status(500).json({ message: "Error updating expense", error: error.message });
    }
};

/**
 * @desc    Get expense categories summary for a month/year
 * @route   GET /api/admin/finance/expense-summary
 * @access  Admin
 */
export const getExpenseSummary = async (req, res) => {
    try {
        const { month, year } = req.query;

        if (!month || !year) {
            return res.status(400).json({ message: "Month and year are required" });
        }

        const expenses = await Expense.find({ month, year: Number(year) });

        const summary = expenses.reduce(
            (acc, exp) => {
                acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
                acc.total += exp.amount;
                acc.count++;
                return acc;
            },
            { total: 0, count: 0 }
        );

        // Add zero defaults for empty categories
        const allCategories = ['Teacher Salary', 'Receptionist Salary', 'Rent', 'Utility Bill', 'Other Bill', 'Other Cost'];
        allCategories.forEach(cat => {
            if (!(cat in summary)) {
                summary[cat] = 0;
            }
        });

        res.status(200).json({
            success: true,
            data: summary
        });
    } catch (error) {
        console.error("Get Expense Summary Error:", error);
        res.status(500).json({ message: "Error fetching expense summary", error: error.message });
    }
};

/**
 * @desc    Get all expense categories for filtering
 * @route   GET /api/admin/finance/expense-categories
 * @access  Admin
 */
export const getExpenseCategories = async (req, res) => {
    try {
        const categories = ['Teacher Salary', 'Receptionist Salary', 'Rent', 'Utility Bill', 'Other Bill', 'Other Cost'];
        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching categories", error: error.message });
    }
};

// ================ HELPER FUNCTIONS ================

/**
 * Calculate finance summary from raw data (fees, salaries, expenses)
 */
async function calculateFinanceSummary(month, year) {
    // Aggregate fees
    const feeAgg = await Fee.aggregate([
        {
            $match: { month, year }
        },
        {
            $group: {
                _id: null,
                totalFees: { $sum: "$feesAmount" },
                count: { $sum: 1 }
            }
        }
    ]);

    const totalFeesCollected = feeAgg.length > 0 ? feeAgg[0].totalFees : 0;
    const totalFeesCount = feeAgg.length > 0 ? feeAgg[0].count : 0;

    // Aggregate salaries from TeacherProfile and ReceptionProfile
    const teacherAgg = await TeacherProfile.aggregate([
        {
            $group: {
                _id: null,
                totalSalary: { $sum: "$salary" }
            }
        }
    ]);
    const teacherSalaryTotal = teacherAgg.length > 0 ? teacherAgg[0].totalSalary : 0;

    const receptionAgg = await ReceptionProfileModel.aggregate([
        {
            $group: {
                _id: null,
                totalSalary: { $sum: "$salary" }
            }
        }
    ]);
    const receptionistSalaryTotal = receptionAgg.length > 0 ? receptionAgg[0].totalSalary : 0;

    // Aggregate expenses by category
    const expenseAgg = await Expense.aggregate([
        {
            $match: { month, year }
        },
        {
            $group: {
                _id: "$category",
                total: { $sum: "$amount" }
            }
        }
    ]);

    const expenseMap = {};
    expenseAgg.forEach(e => {
        expenseMap[e._id] = e.total;
    });

    const totalRent = expenseMap['Rent'] || 0;
    const totalUtilityBills = expenseMap['Utility Bill'] || 0;
    const totalOtherBills = (expenseMap['Other Bill'] || 0);
    const totalOtherCosts = (expenseMap['Other Cost'] || 0);
    const teacherSalaryExp = expenseMap['Teacher Salary'] || 0;
    const receptionistSalaryExp = expenseMap['Receptionist Salary'] || 0;

    // Use profile-based salaries if no expense records exist
    const teacherSalary = teacherSalaryExp > 0 ? teacherSalaryExp : teacherSalaryTotal;
    const receptionistSalary = receptionistSalaryExp > 0 ? receptionistSalaryExp : receptionistSalaryTotal;

    const totalSalaries = teacherSalary + receptionistSalary;
    const totalExpenses = totalSalaries + totalRent + totalUtilityBills + totalOtherBills + totalOtherCosts;
    const totalRevenue = totalFeesCollected;
    const netProfit = totalRevenue - totalExpenses;
    const totalExpensesCount = await Expense.countDocuments({ month, year });

    // Create or update the Finance record
    const summary = await Finance.findOneAndUpdate(
        { month, year },
        {
            totalFeesCollected,
            totalRevenue,
            teacherSalaryTotal: teacherSalary,
            receptionistSalaryTotal: receptionistSalary,
            totalSalaries,
            totalRent,
            totalUtilityBills,
            totalOtherBills,
            totalOtherCosts,
            totalExpenses,
            netProfit,
            totalExpensesCount,
            totalFeesCount
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return summary;
}

/**
 * Recalculate and update the finance summary for a given month/year
 */
async function recalculateFinanceSummary(month, year) {
    await calculateFinanceSummary(month, year);
}

/**
 * @desc    Get finance overview across all months for a year
 * @route   GET /api/admin/finance/overview/:year
 * @access  Admin
 */
export const getFinanceOverview = async (req, res) => {
    try {
        const { year } = req.params;

        const records = await Finance.find({ year: Number(year) })
            .sort({ month: 1 })
            .lean();

        // If no pre-computed records, calculate from raw data
        if (records.length === 0) {
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            const overview = [];

            for (const m of monthNames) {
                const summary = await calculateFinanceSummary(m, Number(year));
                overview.push(summary);
            }

            return res.status(200).json({
                success: true,
                year: Number(year),
                data: overview
            });
        }

        res.status(200).json({
            success: true,
            year: Number(year),
            data: records
        });
    } catch (error) {
        console.error("Get Finance Overview Error:", error);
        res.status(500).json({ message: "Error fetching finance overview", error: error.message });
    }
};
