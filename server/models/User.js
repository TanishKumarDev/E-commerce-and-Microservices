import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        required: user,
    },
    
    timestamps: true, // add createdAt and updatedAt
});

export const User = mongoose.model("User", userSchema);