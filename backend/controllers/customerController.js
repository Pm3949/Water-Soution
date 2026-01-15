import Customer from "../models/Customer.js";
import { sendWhatsapp, sendSMS } from '../utils/messageService.js';

export const addCustomer = async (req, res) => {
  try {
    const { name, phone, address, lastServiceDate } = req.body;

    const customer = new Customer({
      name,
      phone,
      address,
      lastServiceDate,
      nextServiceDate: new Date(
        new Date(lastServiceDate).setDate(
          new Date(lastServiceDate).getDate() + 90
        )
      ),
    });

    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Update allowed fields
    if (req.body.name !== undefined) customer.name = req.body.name;
    if (req.body.phone !== undefined) customer.phone = req.body.phone;
    if (req.body.address !== undefined) customer.address = req.body.address;
    if (req.body.lastServiceDate !== undefined) {
      customer.lastServiceDate = req.body.lastServiceDate;
      // nextServiceDate auto updates via pre-save hook
    }

    await customer.save(); 

    res.json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const deleteCustomer = async (req, res) => {
  try {
    const deleted = await Customer.findByIdAndDelete(req.params.id);
    console.log("DELETE HIT:", req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json({ message: "Customer deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendManualReminder = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if(!customer){
            return res.status(404).json({message: "Customer not found"});
        }

        await sendSMS(customer.phone, customer.name);
        await sendWhatsapp(customer.phone, customer.name);

        res.json({message: "Reminders sent successfully"});
    } catch (error) {
       console.error("REMINDER ERROR:", error);   
        res.status(500).json({message: error.message});
    }
};

export const getOverdueCustomers = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdueCustomers = await Customer.find({
      nextServiceDate: { $lt: today },
    }).sort({ nextServiceDate: 1 });

    res.json(overdueCustomers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const markServiceDone = async (req, res) => {
  try {
    // console.log("SERVICE DONE HIT:", req.params.id);

    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Normalize today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ✅ Update last service
    customer.lastServiceDate = today;

    // ✅ Create NEW date object for next service
    const nextService = new Date(today);
    nextService.setDate(nextService.getDate() + 90);

    customer.nextServiceDate = nextService;

    await customer.save();

    // console.log("SERVICE UPDATED:", customer._id);
    res.json(customer);

  } catch (error) {
    console.error("SERVICE DONE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
