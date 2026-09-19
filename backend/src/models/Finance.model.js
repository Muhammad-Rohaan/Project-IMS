import mongoose from "mongoose";

const financeSchema = new mongoose.Schema(
    {
<<<<<<< HEAD
        stdId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'StudentProfile',
            required: true,
            // unique: true
        },

    }
);
=======
        // ---- Month & Year Identifier ----
        month: {
            type: String,
            enum: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            required: true
        },
        year: {
            type: Number,
            required: true
        },

        // ---- REVENUE ----
        // Total fees collected from students for this month/year
        totalFeesCollected: {
            type: Number,
            default: 0
        },

        // Total revenue from all sources (fees + any other income)
        totalRevenue: {
            type: Number,
            default: 0
        },

        // ---- SALARIES ----
        // Total teacher salaries paid this month/year
        teacherSalaryTotal: {
            type: Number,
            default: 0
        },

        // Total receptionist salaries paid this month/year
        receptionistSalaryTotal: {
            type: Number,
            default: 0
        },

        // Combined salaries (teacher + receptionist)
        totalSalaries: {
            type: Number,
            default: 0
        },

        // ---- EXPENSES BREAKDOWN ----
        // Total rent/lease payments this month/year
        totalRent: {
            type: Number,
            default: 0
        },

        // Total utility bills (electricity, water, gas, internet, phone) this month/year
        totalUtilityBills: {
            type: Number,
            default: 0
        },

        // Total other bills (insurance, subscriptions, maintenance, etc.) this month/year
        totalOtherBills: {
            type: Number,
            default: 0
        },

        // All other miscellaneous costs this month/year
        totalOtherCosts: {
            type: Number,
            default: 0
        },

        // ---- EXPENSES SUMMARY ----
        // Total expenses = salaries + rent + utilities + other bills + other costs
        totalExpenses: {
            type: Number,
            default: 0
        },

        // ---- PROFIT ----
        // Net profit = totalRevenue - totalExpenses
        netProfit: {
            type: Number,
            default: 0
        },

        // ---- COUNTS (for quick reference) ----
        totalExpensesCount: {
            type: Number,
            default: 0
        },

        totalFeesCount: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

// Compound index for fast month/year lookups
financeSchema.index({ month: 1, year: 1 }, { unique: true });

export default mongoose.model('Finance', financeSchema);
>>>>>>> 87b2158d27f6dc65342bf63d16c93496879a6be3
