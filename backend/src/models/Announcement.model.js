import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    target: {
        type: String,
        enum: ['all', 'specific-class']
    },
    className: String,
    createdBy: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default mongoose.model('Announcement', announcementSchema);