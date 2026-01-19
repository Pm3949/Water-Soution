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
    const { intervalDays } = req.body; // 👈 NEW

    if (!intervalDays || intervalDays <= 0) {
      return res.status(400).json({ message: "Invalid service interval" });
    }

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

    const customer = await Customer.findById(service.customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    customer.lastServiceDate = today;
    customer.serviceIntervalDays = intervalDays;
    // nextServiceDate auto-calculated by pre-save hook

    await customer.save();

    res.json({
      message: "Service completed successfully",
      nextServiceDate: customer.nextServiceDate,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to complete service" });
  }
};
