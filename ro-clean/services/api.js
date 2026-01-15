import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5000", // or localhost
// });

const API = axios.create({
  baseURL: "https://water-soution-backend.onrender.com", // or localhost
});

export const loginApi = (data) => API.post("/users/login", data);

export const getWorkers = (token) =>
  API.get("/users/workers", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createWorker = (data, token) =>
  API.post("/users/workers", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteWorker = (id, token) =>
  API.delete(`/users/workers/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const resetWorkerPin = (id, newPin, token) =>
  API.put(
    `/users/workers/${id}/reset-pin`,
    { newPin },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

// Customers APIs (MATCHING YOUR BACKEND ROUTES)

export const getCustomers = (token) =>
  API.get("/customers", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createCustomer = (data, token) =>
  API.post("/customers/add", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateCustomer = (id, data, token) =>
  API.put(`/customers/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteCustomer = (id, token) =>
  API.delete(`/customers/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const sendReminder = (id, token) =>
  API.post(
    `/customers/${id}/send-reminder`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

export const markServiceDone = (id, token) => {
  API.put(
    `/customers/${id}/service-done`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
