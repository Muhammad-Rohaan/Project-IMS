import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
    },

    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter valid email address'],
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false,  // find() pe nhi dikhe ga
    },

    role: {
        type: String,
        enum: ['admin', 'receptionist', 'teacher', 'student'],
        required: [true, 'Role is required'],
        lowercase: true,
    },

    isActive: {  // still in Coa
        type: Boolean,
        default: true,
    }
}, { timestamps: true });

// userSchema.index({ email: 1 }); // Email ke basis par fast searching ke liye
// userSchema.index({ role: 1 }); // Role-wise filtering ke liye

export default mongoose.model('User', userSchema);