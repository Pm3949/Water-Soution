import cron from "node-cron";
import Customer from "../models/Customer.js";
import { sendSMS, sendWhatsapp } from "./messageService.js";

cron.schedule("0 10 * * *", async () => {
  console.log("🔔 Running daily reminder job");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const customers = await Customer.find({
    nextServiceDate: { $lte: today },
  });

  for (const c of customers) {
    console.log(`📨 Sending reminder to ${c.name}`);

    await sendSMS(c.phone, c.name);
    await sendWhatsapp(c.phone, c.name);

    // IMPORTANT: move service cycle forward
    c.lastServiceDate = today;
    c.nextServiceDate = new Date(
      today.setDate(today.getDate() + 90)
    );

    await c.save();
  }
});
