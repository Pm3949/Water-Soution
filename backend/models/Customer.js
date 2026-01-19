import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    address: { type: String, required: true },

    // 🆕 Customer first time join date
    joinedAt: {
      type: Date,
      default: Date.now,
      immutable: true, // 🔒 kabhi change nahi hoga
    },

    lastServiceDate: {
      type: Date,
      required: true,
    },

    // ❌ enum removed → fully flexible
    serviceIntervalDays: {
      type: Number,
      required: true,
      min: 1, // safety
    },

    nextServiceDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// 🔁 Auto-calc next service
customerSchema.pre("save", function () {
  if (
    this.isModified("lastServiceDate") ||
    this.isModified("serviceIntervalDays")
  ) {
    const next = new Date(this.lastServiceDate);
    next.setDate(next.getDate() + this.serviceIntervalDays);
    this.nextServiceDate = next;
  }
});

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;
