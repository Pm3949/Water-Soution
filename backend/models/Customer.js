import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    address: { type: String, required: true },

    lastServiceDate: {
      type: Date,
      required: true,
    },

    nextServiceDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// ✅ ASYNC hook — no next(), no done()
customerSchema.pre("save", async function () {
  if (this.isModified("lastServiceDate")) {
    const nextService = new Date(this.lastServiceDate);
    nextService.setDate(nextService.getDate() + 90);
    this.nextServiceDate = nextService;
  }
});

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;
