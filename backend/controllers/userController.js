import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ========== BOOTSTRAP OWNER (ONLY ONCE - POSTMAN) ==========
export const bootstrapOwner = async (req, res) => {
  try {
    const { name, phone, pin } = req.body;

    const ownerExists = await User.findOne({ role: "owner" });
    if (ownerExists) {
      return res.status(400).json({ message: "Owner already exists" });
    }

    const owner = await User.create({
      name,
      phone,
      role: "owner",
      pinHash: await bcrypt.hash(pin, 10),
    });

    res.json({ message: "Owner created successfully", owner });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========== LOGIN ==========
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
      { expiresIn: "7d" }
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

// ========== CREATE WORKER (OWNER ONLY) ==========
export const createWorker = async (req, res) => {
  try {
    const { name, phone, pin } = req.body;

    if (req.user.role !== "owner") {
      return res.status(403).json({ message: "Only owner can create workers" });
    }

    const exists = await User.findOne({ phone });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const worker = await User.create({
      name,
      phone,
      role: "worker",
      pinHash: await bcrypt.hash(pin, 10),
    });

    res.json({ message: "Worker created successfully", worker });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========== CHANGE OWN PIN ==========
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
    res.status(500).json({ message: "Failed to change PIN" });
  }
};

// ========== RESET WORKER PIN ==========
export const resetWorkerPin = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({ message: "Owner only" });
    }

    const worker = await User.findById(req.params.id);
    if (!worker) return res.status(404).json({ message: "Worker not found" });

    worker.pinHash = await bcrypt.hash(req.body.newPin, 10);
    await worker.save();

    res.json({ message: "Worker PIN reset successfully" });
  } catch {
    res.status(500).json({ message: "Failed to reset PIN" });
  }
};

// ========== LIST WORKERS ==========
export const listWorkers = async (req, res) => {
  if (req.user.role !== "owner") {
    return res.status(403).json({ message: "Owner only" });
  }

  const workers = await User.find({ role: "worker" }).sort({ createdAt: -1 });
  res.json(workers);
};

// ========== UPDATE WORKER ==========
export const updateWorker = async (req, res) => {
  if (req.user.role !== "owner") {
    return res.status(403).json({ message: "Owner only" });
  }

  const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!updated) return res.status(404).json({ message: "Worker not found" });

  res.json(updated);
};

// ========== DELETE WORKER ==========
export const deleteWorker = async (req, res) => {
  if (req.user.role !== "owner") {
    return res.status(403).json({ message: "Owner only" });
  }

  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Worker deleted" });
};

// ========== SEARCH WORKER ==========
export const searchWorker = async (req, res) => {
  if (req.user.role !== "owner") {
    return res.status(403).json({ message: "Owner only" });
  }

  const workers = await User.find({
    role: "worker",
    phone: { $regex: req.query.phone || "", $options: "i" },
  });

  res.json(workers);
};
