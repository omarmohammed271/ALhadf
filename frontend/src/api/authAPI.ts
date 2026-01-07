import { axiosAuthInstance, axiosInstance, axiosMutateInstance } from "./axiosInstance";

export interface LoginData{
    username: string,
    password: string,
}

export const handleLogin = async (data: LoginData) => {
    return axiosAuthInstance.post(`api/account/login/`, data).then(res => res.data);
}

export const getUsers = async (data: any) => {
    return axiosInstance.get(`api/account/users/`, data).then(res => res.data);
}



