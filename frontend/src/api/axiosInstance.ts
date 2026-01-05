// src/api/axiosInstance.js
import axios from 'axios';

export const baseURL = `127.0.0.1:8000`

export const axiosInstance = axios.create({
  baseURL: `http://${baseURL}/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const axiosMutateInstance = axios.create({
  baseURL: `http://${baseURL}/`,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});