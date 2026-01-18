import Service from "../models/Service.js";
import Customer from "../models/Customer.js";

/**
 * CREATE SERVICE
 */
export const createService = async (req, res) => {
  try {
    const { customerId, serviceDate, assignedWorkerId } = req.body;

    if (!customerId || !serviceDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const service = await Service.create({
      customerId,
      serviceDate,
      assignedWorkerId: assignedWorkerId || null,
      createdBy: req.user._id,
    });

    res.status(201).json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create service" });
  }
};

/**
 * GET PENDING SERVICES
 */
export const getPendingServices = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const query = {
      status: "pending",
      serviceDate: { $lte: today },
      createdBy: req.user._id,
    };

    if (req.user.role === "worker") {
      query.assignedWorkerId = req.user._id;
    }

    const services = await Service.find(query)
      .populate("customerId")
      .populate("assignedWorkerId", "name phone")
      .sort({ serviceDate: 1 });

    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load services" });
  }
};

/**
 * COMPLETE SERVICE
 */
export const completeService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (service.status === "completed") {
      return res.status(400).json({ message: "Already completed" });
    }

    service.status = "completed";
    service.completedAt = new Date();
    await service.save();

    const completedDate = new Date();

    // calculate next service date (+90 days)
    const nextServiceDate = new Date(completedDate);
    nextServiceDate.setDate(nextServiceDate.getDate() + 90);

    await Customer.findByIdAndUpdate(service.customerId, {
      lastServiceDate: completedDate,
      nextServiceDate: nextServiceDate,
    });

    res.json({ message: "Service completed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to complete service" });
  }
};
