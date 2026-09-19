import mongoose from "mongoose";


const receptionProfileSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },

    receptionistFullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
    },

    receptionRegId: {  
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

    salary: {
        type: Number,
        required: true,
        min: 0,
    },

    joiningDate: {
        type: Date,
        default: Date.now,
    },

    contact: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },



}, {
    timestamps: true
});


export default mongoose.model('ReceptionProfile', receptionProfileSchema);