// models/ResultImage.model.js
import mongoose from 'mongoose';

const resultImageSchema = new mongoose.Schema({
  className: {
    type: String,
    required: [true, 'Class name is required'],
    uppercase: true,
    trim: true,
  },
  testName: {
    type: String,
    required: [true, 'Test name is required'],
    trim: true,
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required']
  },
  publicId: String, // Cloudinary ka ID (delete ke liye)
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Unique: Ek class ka ek test ka sirf ek result
resultImageSchema.index({ className: 1, testName: 1 }, { unique: true });
resultImageSchema.index({ className: 1 });
resultImageSchema.index({ uploadedBy: 1 });

export default mongoose.model('ResultImage', resultImageSchema);