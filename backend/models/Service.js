import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    serviceDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },

    assignedWorkerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

serviceSchema.index(
  { completedAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 2 }
);

export default mongoose.model("Service", serviceSchema);
