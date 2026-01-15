import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    
    phone:{
        type: String,
        required: true,
        unique: true
    },

    address:{
        type: String,
        required: true
    },

    lastServiceDate:{
        type: Date,
        required: true
    },
},{timestamps: true});

// Auto-calculate next service date
customerSchema.pre("save", function (next) {
  if (this.isModified("lastServiceDate")) {
    const d = new Date(this.lastServiceDate);
    d.setDate(d.getDate() + 90);
    this.nextServiceDate = d;
  }
  next();
});

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;