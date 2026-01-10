// src/api/axiosInstance.js
import axios from 'axios';


export const baseURL = `87.237.225.79:8000`

export const axiosInstance = axios.create({
  baseURL: `https://${baseURL}/`,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Token ${localStorage.getItem('user-token')}`
  },
});

export const axiosAuthInstance = axios.create({
  baseURL: `https://${baseURL}/`,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const axiosMutateInstance = axios.create({
    baseURL: `https://${baseURL}/`,
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Token ${localStorage.getItem('user-token')}`
    },
  });
