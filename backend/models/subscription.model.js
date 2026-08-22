import mongoose from "mongoose";
import User from "./user.model.js";

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subscription name is required"],
      trim: true,
      minLength: 2,
      maxLength: 100,
    },
    plan: {
      type: String,
      required: [true, "Subscription plan is required"],
      trim: true,
      enum: ["basic", "standard", "premium", "custom"],
      default: "standard",
    },
    price: {
      type: Number,
      required: [true, "Subscription amount is required"],
      min: [0, "Amount must be positive"],
    },
    currency: {
      type: String,
      required: [true, "Currency is required"],
      trim: true,
      uppercase: true,
      default: "INR",
      enum: ["USD", "EUR", "GBP", "INR"],
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
      required: true,
    },
    category: {
      type: String,
      enum: [
        "sports",
        "news",
        "entertainment",
        "lifestyle",
        "technology",
        "finance",
        "politics",
        "other",
      ],
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "paused", "cancelled", "expired", "trial"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: [true, "Subscription start date is required"],
      validate: {
        validator: (value) => value <= new Date(Date.now() + 60000),
        message: "Start date must be today or in the past",
      },
    },
    renewalDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "Renewal date must be after the start date",
      },
    },
    User: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

// auto calculate renewal date if missing or modified
subscriptionSchema.pre("save", async function () {
  const renewalPeriods = {
    daily: 1,
    weekly: 7,
    monthly: 30,
    yearly: 365,
  };

  if (this.isNew || this.isModified("startDate") || this.isModified("frequency")) {
    const daysToAdd = renewalPeriods[this.frequency] || 30;
    const now = new Date();
    let nextRenewal = new Date(this.startDate);
    nextRenewal.setDate(nextRenewal.getDate() + daysToAdd);

    // Roll forward active recurring subscriptions past historic start dates
    if (this.status === "active") {
      let safetyCounter = 0;
      while (nextRenewal <= now && safetyCounter < 500) {
        nextRenewal.setDate(nextRenewal.getDate() + daysToAdd);
        safetyCounter++;
      }
    }

    this.renewalDate = nextRenewal;

    if (this.renewalDate < now && this.status !== "cancelled") {
      this.status = "expired";
    }
  }
});
const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
