import { create } from "zustand";
import { persist } from 'zustand/middleware';

type UserData = {
    id?: any;
    username: string;
    email: string,
    token: string;
    role: string;
    first_name: string;
    last_name: string;
    position: string;
    isLogged: boolean;
}

export interface UserStore{
    userData: UserData;
    setUserData: (data: UserData) => void;
    logOut: () => void;
}

export const useUserStore = create(
    persist<UserStore>(
        (set) => ({
            userData: {
                id: "tttt",
                role: "tttt",
                username: "demo",
                email: "demo@gmail.com",
                token: "tttt",
                first_name: "string",
                last_name: "string",
                position: "Staff",
                isLogged: true,
            },
            setUserData: (data) => set(() => ({userData: data})),
            logOut: () => set((state) => ({userData: {...state.userData, isLogged: false}}))
        }),
        {
            name: "user-data-state"
        }
    )
)