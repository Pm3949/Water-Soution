import cron from 'node-cron';
import Customer from '../models/Customer.js';
import { sendSMS, sendWhatsapp } from './messageService.js';


cron.schedule('0 10 * * *', async () => {
    console.log('Running daily reminder job at 10:00 AM');

    const customers = await Customer.find();

    for(const c of customers){
        const daypassed = (new Date() - new Date(c.lastServiceDate)) / (1000 * 60 * 60 * 24);
        if(daypassed >= 90){
            console.log(`Reminder should go to: ${c.name} - ${c.phone}`);
            
            await sendSMS(c.phone, c.name);
            await sendWhatsapp(c.phone, c.name);
        }
    };
});