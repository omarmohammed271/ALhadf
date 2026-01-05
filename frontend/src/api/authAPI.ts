import { axiosInstance, axiosMutateInstance } from "./axiosInstance";

export interface LoginData{
    email: string,
    password: string,
}

export const handleLogin = async (data: LoginData) => {
    // Temporary
    return axiosMutateInstance.post(`api/users/login/`, data).then(res => res.data);
}
