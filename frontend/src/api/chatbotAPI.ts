import { axiosInstance } from "./axiosInstance";

// ChatBot Queries
export const fetchBusiestERSection = async () => {
    const { data } = await axiosInstance.get("api/patients/chatbot/busiest-er-section");
    return data;
    
  };
  
  export const fetchMostCommonTriage = async () => {
    const { data } = await axiosInstance.get("api/patients/chatbot/most-common-triage");
    return data;
  };
  
  export const fetchAvgCommunicationsPerVisit = async () => {
    const { data } = await axiosInstance.get("api/patients/chatbot/avg-communications-per-visit");
    return data;
  };
  
  export const fetchWorstSatisfactionSection = async () => {
    const { data } = await axiosInstance.get("api/patients/chatbot/worst-satisfaction-section");
    return data;
  };
  
  export const fetchVisitsWithoutCommunication = async () => {
    const { data } = await axiosInstance.get("api/patients/chatbot/visits-without-communication");
    return data;
  };
  
  export const fetchBusiestShift = async () => {
    const { data } = await axiosInstance.get("api/patients/chatbot/busiest-shift");
    return data;
  };
  
  export const fetchAvgTimeToFirstContactLWBS = async () => {
    const { data } = await axiosInstance.get("api/patients/chatbot/avg-time-to-first-contact-lwbs");
    return data;
  };
  
  export const fetchMostCommonFailureReason = async () => {
    const { data } = await axiosInstance.get("api/patients/chatbot/most-common-failure-reason");
    return data;
  };
  