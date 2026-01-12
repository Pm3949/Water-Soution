import User from "../models/User.js";
import bcrypt from "bcryptjs";

//Change own PIN
export const changePin = async (req, res) => {
  try {
    const { oldPin, newPin } = req.body;
    const user = await User.findById(req.userId);

    const match = await bcrypt.compare(oldPin, user.pinHash);
    if (!match) {
      return res.status(400).json({ message: "Old PIN is incorrect" });
    }

    user.pinHash = await bcrypt.hash(newPin, 10);
    await user.save();
    res.json({ message: "PIN changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to change PIN", error });
  }
};


// Create owner (first time) OR create worker (owner only)
export const createWorker = async (req, res) => {
  try {
    const { name, phone, pin, role } = req.body;

    // Check if any owner exists
    const ownerExists = await User.findOne({ role: "owner" });

    // If no owner yet, allow creating owner
    if (!ownerExists) {
      const newOwner = new User({
        name,
        phone,
        role: "owner",
        pinHash: bcrypt.hashSync(pin, 10),
      });

      await newOwner.save();

      return res.json({ message: "Owner created successfully", user: newOwner });
    }

    // If owner already exists, only owner can add workers
    if (req.user.role !== "owner") {
      return res.status(403).json({ message: "Only owner can add worker" });
    }

    // Create worker
    const worker = new User({
      name,
      phone,
      role: "worker",
      pinHash: bcrypt.hashSync(pin, 10),
    });

    await worker.save();

    res.json({ message: "Worker created successfully", user: worker });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reset worker PIN
export const resetWorkerPin = async (req, res) => {
    try {
        const {newPin} = req.body;
        const workerId = req.params.id;

        if(req.user.role !== "owner"){
            return res.status(403).json({message: "Only owners can reset worker PINs"});
        }

        const worker = await User.findById(workerId);
        if(!worker){
            return res.status(404).json({message: "Worker not found"});
        }
        worker.pinHash = await bcrypt.hash(newPin, 10);
        await worker.save();
        res.json({message: "Worker PIN reset successfully"});
    } catch (error) {
        res.status(500).json({message: "Failed to reset worker PIN", error});
    }
};


// List all workers
export const listWorkers = async (req, res) => {
  if (req.user.role !== "owner") {
    return res.status(403).json({ message: "Owner only" });
  }

  const workers = await User.find({ role: "worker" }).sort({ createdAt: -1 });
  res.json(workers);
};



// Update worker
export const updateWorker = async (req, res) => {
  if (req.user.role !== "owner") {
    return res.status(403).json({ message: "Owner only" });
  }

  const updated = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!updated) return res.status(404).json({ message: "Worker not found" });

  res.json(updated);
};

// Delete worker
export const deleteWorker = async (req, res) => {
  if (req.user.role !== "owner") {
    return res.status(403).json({ message: "Owner only" });
  }

  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Worker deleted" });
};

// Search worker by phone
export const searchWorker = async (req, res) => {
  if (req.user.role !== "owner") {
    return res.status(403).json({ message: "Owner only" });
  }

  const { phone } = req.query;

  const workers = await User.find({
    role: "worker",
    phone: { $regex: phone, $options: "i" },
  });

  res.json(workers);
};


import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { phone, pin } = req.body;

    const user = await User.findOne({ phone });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(pin, user.pinHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1Y" }
    );

    res.json({
      token,
      role: user.role,
      name: user.name,
      phone: user.phone,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
