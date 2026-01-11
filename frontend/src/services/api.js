import axios from 'axios';

const API = axios.create({
  baseURL: 'https://water-soution-backend.onrender.com',
});

export const API;
