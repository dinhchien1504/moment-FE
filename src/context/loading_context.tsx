"use client"
import API from '@/api/api';
import { FetchServerGetApi } from '@/api/fetch_server_api';
import { createContext, useContext, useState, ReactNode } from 'react';

type LoadingContextType = {

    startLoadingSpiner:() => void;
    stopLoadingSpiner:() => void
    isLoading:boolean
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const startLoadingSpiner = () => {
        setIsLoading(true)
    }


    const stopLoadingSpiner = () => {
        setIsLoading(false)
    }



    return (

        <LoadingContext.Provider value={{ startLoadingSpiner, stopLoadingSpiner, isLoading }}>
            {children}
        </LoadingContext.Provider>

    );
};

export const useLoadingContext = () => {
    const context = useContext(LoadingContext);
    if (!context) throw new Error('useUserContext must be used within a UserProvider');
    return context;
};
