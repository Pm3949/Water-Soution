import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    customerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
    },

    serviceDate:{
        type: Date,
        required: true,
    },

    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },

    assignedWorkerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // worker
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
      index: { expireAfterSeconds: 172800 }, // 2 days
    },
}, {timestamps: true});

const Service = mongoose.model("Service", serviceSchema);
export default Service;
