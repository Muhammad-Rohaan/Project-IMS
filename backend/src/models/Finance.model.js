import mongoose from "mongoose";

const financeSchema = new mongoose.Schema(
    {
        stdId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'StudentProfile',
            required: true,
            // unique: true
        },

    }
);