import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
    {
        // ---- Expense Title & Description ----
        title: {
            type: String,
            required: [true, 'Expense title is required'],
            trim: true,
            maxlength: [100, 'Title cannot exceed 100 characters']
        },

        description: {
            type: String,
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters']
        },

        // ---- Category ----
        category: {
            type: String,
            enum: ['Teacher Salary', 'Receptionist Salary', 'Rent', 'Utility Bill', 'Other Bill', 'Other Cost'],
            required: [true, 'Expense category is required']
        },

        // ---- Amount ----
        amount: {
            type: Number,
            required: [true, 'Expense amount is required'],
            min: [0, 'Amount must be positive']
        },

        // ---- Month & Year ----
        month: {
            type: String,
            enum: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            required: true
        },

        year: {
            type: Number,
            required: true
        },

        // ---- Reference (optional: link expense to a person/entity) ----
        referenceId: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'referenceModel'  // Polymorphic reference
        },

        referenceModel: {
            type: String,
            enum: ['TeacherProfile', 'ReceptionProfile']
        },

        referenceName: {
            type: String,
            trim: true
        },

        // ---- Payment Details ----
        paidBy: {
            type: String,
            trim: true,
            default: 'Admin'
        },

        paymentMethod: {
            type: String,
            enum: ['Cash', 'Bank Transfer', 'Cheque', 'Online', 'Other'],
            default: 'Cash'
        },

        transactionRef: {
            type: String,
            trim: true
        },

        // ---- Status ----
        status: {
            type: String,
            enum: ['pending', 'paid', 'partial'],
            default: 'paid'
        },

        date: {
            type: Date,
            default: Date.now
        },

        notes: {
            type: String,
            trim: true
        }
    },
    { timestamps: true }
);

// Indexes for efficient querying by month/year/category
expenseSchema.index({ month: 1, year: 1 });
expenseSchema.index({ category: 1, month: 1, year: 1 });
expenseSchema.index({ referenceId: 1, referenceModel: 1 });

export default mongoose.model('Expense', expenseSchema);
