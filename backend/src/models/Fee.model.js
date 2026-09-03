import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema({

    // _id generate by mongo

    stdId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudentProfile',
        required: true,
        // unique: true
    },

    rollNo: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
    },

    studentName: String,
    
    className: String,

    month: {
        type: String, // "January 2025", "February 2025"
        enum: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        required: true
    },

    year: {
        type: Number,
        required: true
    },

    feesAmount: {   
        type: Number,
        default: 0
    },

    status: {
        type: String,
        enum: ['paid', 'pending', 'unpaid'],
        default: 'pending'
    },
    collectedBy: String, // receptionist name
    collectedDate: { type: Date }


}, { timestamps: true });

export default mongoose.model('Fee', feeSchema);