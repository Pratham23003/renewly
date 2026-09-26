import mongoose from "mongoose";

const usageChargeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subscription",
        required: true,
        index: true
    },
    amount: {
        type: Number,
        required: true,
        min: [0, "Amount must be positive"],
    },
    date: {
        type: Date,
        required: true,
    }
}, { timestamps: true });

const UsageCharge = mongoose.model("UsageCharge", usageChargeSchema);

export default UsageCharge;