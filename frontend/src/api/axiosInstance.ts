// src/api/axiosInstance.js
import { useUserStore } from '@/store/authStore';
import axios from 'axios';


export const baseURL = `127.0.0.1:8000`


export const axiosInstance = () => {

  const userData = useUserStore(state => state.userData);

  return (axios.create({
    baseURL: `http://${baseURL}/`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${userData.token}`
    },
  }))
};

export const axiosMutateInstance = () => {

  const userData = useUserStore(state => state.userData);

  return (axios.create({
    baseURL: `http://${baseURL}/`,
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Token ${userData.token}`
    },
  }))
};