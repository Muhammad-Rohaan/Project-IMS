import mongoose from 'mongoose';

const teacherProfileSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },

    teacherFullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
    },

    teacherRegId: {  // from this teacher can login
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true
    },

    cnic: {
        type: String,
        required: true,
        unique: true,
        match: [/^\d{5}-\d{7}-\d$/, 'CNIC format: 42123-1234567-1'],
    },

    qualification: {
        type: String,
        required: true,
    },

    salary: {
        type: Number,
        required: true,
        min: 0,
    },

    joiningDate: {
        type: Date,
        default: Date.now,
    },

    subjects: {
        type: [String], // Defines the field as an array of strings
        required: true,
        lowercase: true
    },

    classes: {
        type: [Number], // Defines the field as an array of numbers
        required: true   // Ensures the 'classes' field must be provided in the document
    },
    contact: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    age: {
        type: Number,
        required: true
    },
}, { timestamps: true });

// teacherProfileSchema.index({ cnic: 1 }); // CNIC ke basis pr fast searching ke liye

export default mongoose.model('TeacherProfile', teacherProfileSchema);