import Service from "../models/Service.js";
import Customer from "../models/Customer.js";

export const createService = async (req, res) => {
  try {
    const { customerId, serviceDate, assignedWorker } = req.body;

    if (!customerId || !serviceDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const service = await Service.create({
      customerId,
      serviceDate,
      assignedWorkerId: assignedWorker || null,
      createdBy: req.user._id,
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: "Failed to create service" });
  }
};

export const getPendingServices = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const query = {
      status: "pending",
      serviceDate: { $lte: today },
    };

    // Worker sees only assigned services
    if (req.user.role === "worker") {
      query.assignedWorkerId = req.user._id;
    }

    const services = await Service.find(query)
      .populate("customerId")
      .populate("assignedWorkerId", "name phone")
      .sort({ serviceDate: 1 }); // oldest first

    res.json(services);
  } catch (err) {
    res.status(500).json({ message: "Failed to load services" });
  }
};


export const completeService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(400).json({ message: "Service not found" });
    }

    if (service.status === "completed") {
      return res.status(400).json({ message: "Already completed" });
    }

    service.status = "completed";
    service.completedAt = new Date();
    await service.save();

    await Customer.findByIdAndUpdate(service.customerId, {
      lastServiceDate: new Date(),
    });

    res.json({ message: "Service completed successfully" });
  } catch (error) {
    res.status(500).json({message: "Failed to complete service"});
  }
};
