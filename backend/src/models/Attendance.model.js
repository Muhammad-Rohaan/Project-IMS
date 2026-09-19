import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({

    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudentProfile',
        required: true
    },
    rollNo: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
    },
    studentName: String,
    className: String,
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['present', 'absent', 'late', 'leave'],
        default: 'present'
    },



}, { timestamps: true });

attendanceSchema.index({studentId: 1, date: 1}, {unique: true});
export default mongoose.model('Attendance', attendanceSchema);