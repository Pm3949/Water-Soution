import axios from "axios";

const API = axios.create({
  baseURL: "https://water-soution-backend.onrender.com",
});

export const login = (data) => API.post("/auth/login", data);

export const getCustomers = () => API.get("/customers");

export const addCustomer = (data) => API.post("/customers/add", data);

export const sendReminder = (id) =>
  API.post(`/customers/${id}/remind`);
