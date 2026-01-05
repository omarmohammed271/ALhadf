import { create } from "zustand";
import { persist } from 'zustand/middleware';

type UserData = {
    id?: any;
    username: string;
    email: string,
    token: string;
    role: string;
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
                userId: "tttt",
                role: "tttt",
                username: "demo",
                email: "demo@gmail.com",
                token: "tttt",
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