import { axiosInstance, axiosMutateInstance } from "./axiosInstance";


// Create a new alert
export const handleCreateAlert = async (data: any) => {
  
  return axiosMutateInstance.post(`api/alerts/alerts/`, data).then(res => res.data);
};

// Fetch alerts for a specific user
export const getUserAlerts: any = async () => {
  return axiosInstance
    .get(`api/alerts/user-alerts`)
    .then(res => res.data);
};



// --- ER Visits ---
export const getERVisits = async () => {
  const res = await axiosInstance.get("api/patients/visits/");
  return res.data;
};

export const createERVisit = async (data: any) => {
  const res = await axiosMutateInstance.post("api/patients/visits/", data);
  return res.data;
};

// --- Communication Events ---
export const getCommunicationEvents = async () => {
  const res = await axiosInstance.get("api/patients/communication-events/");
  return res.data;
};

export const createCommunicationEvent = async (data: any) => {
  const res = await axiosMutateInstance.post("api/patients/communication-events/", data);
  return res.data;
};

// --- Satisfaction Signals ---
export const getSatisfactionSignals = async () => {
  const res = await axiosInstance.get("api/patients/feedback/");
  return res.data;
};

export const createSatisfactionSignal = async (data: any) => {
  
  const res = await axiosMutateInstance.post("api/patients/feedback/", data);
  return res.data;
};

// --- Context Data ---
export const getContextData = async () => {
  const res = await axiosInstance.get("api/patients/context/");
  return res.data;
};

export const createContextData = async (data: any) => {
  const res = await axiosMutateInstance.post("api/patients/context/", data);
  return res.data;
};

// --- Experience Failure Indicators ---
export const getFailureIndicators = async () => {
  const res = await axiosInstance.get("api/patients/failure-indicators/");
  return res.data;
};

export const createFailureIndicator = async (data: any) => {
  const res = await axiosMutateInstance.post("api/patients/failure-indicators/", data);
  return res.data;
};
