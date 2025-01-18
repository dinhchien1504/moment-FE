"use client"
import API from '@/api/api';
import { FetchServerGetApi } from '@/api/fetch_server_api';
import { createContext, useContext, useState, ReactNode } from 'react';

type PostDetailContextType = {
    postSlug:string,
    setPostSlug: (value:string) => void
};

const PostDetailContext = createContext<PostDetailContextType | undefined>(undefined);

export const PostDetailProvider = ({ children }: { children: ReactNode }) => {

    const [postSlug, setPostSlug] = useState<string> ("")



    return (

        <PostDetailContext.Provider value={{postSlug, setPostSlug }}>
            {children}
        </PostDetailContext.Provider>

    );
};

export const usePostDetailContext = () => {
    const context = useContext(PostDetailContext);
    if (!context) throw new Error('useUserContext must be used within a UserProvider');
    return context;
};

