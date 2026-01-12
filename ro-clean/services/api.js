import axios from "axios";

const API = axios.create({
  baseURL: "https://water-soution-backend.onrender.com", // change if needed
});

export const getCustomers = () => API.get("/customers");
export const addCustomer = (data) => API.post("/customers/add", data);
