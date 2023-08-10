import mongoose from "mongoose";

const resetTokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
});

const ResetToken = mongoose.model("ResetToken", resetTokenSchema);

export default ResetToken;
