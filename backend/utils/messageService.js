import axios from "axios";

const formatPhone = (phone) => {
  if (!phone.startsWith("+")) {
    return `+91${phone}`;
  }
  return phone;
};


export const sendWhatsapp = async (phone, name) => {
  try {
    const sid = process.env.TWILIO_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;

    const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
    const toPhone = formatPhone(phone);
    
    const data = new URLSearchParams({
      From: process.env.TWILIO_WHATSAPP_FROM,
      To: `whatsapp:${toPhone}`,
      Body: `Hello ${name}, your RO service is due. Please call ${process.env.APP_PHONE} to book service.`,
    });

    const res = await axios.post(url, data, {
      auth: {
        username: sid,
        password: token,
      },
    });

    console.log("WhatsApp sent:", res.data);
  } catch (error) {
    console.error("Error sending WhatsApp:", error.response?.data || error.message);
  }
};


export const sendSMS = async (phone, name) => {
  try {
    const sid = process.env.TWILIO_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
     const toPhone = formatPhone(phone);

    const data = new URLSearchParams({
        From: process.env.TWILIO_SMS_FROM,
              To: toPhone,
        Body: `Hello ${name}, your RO service is due. Please call ${process.env.APP_PHONE} to book service.`,
    });

    const res = await axios.post(url, data, {
      auth: {
        username: sid,
        password: token,
      },
    });
    console.log("SMS sent:", res.data);
    } catch (error) {
    console.error("Error sending SMS:", error.response?.data || error.message);
    }
};