"use client"
import API from '@/api/api';
import { FetchServerGetApi } from '@/api/fetch_server_api';
import { createContext, useContext, useState, ReactNode } from 'react';

type UserContextType = {
  user: IUserResponse | undefined;
  setUser: (value: IUserResponse) => void;
  fetchGetUser: () => void
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUserResponse | undefined>(undefined);

  const fetchGetUser = async () => {
    // lay thong tin user
    const res = await FetchServerGetApi(API.AUTH.MY_INFO)
    if (res && res.status === 200) {
      const user: IUserResponse = res.result
      setUser(user)
    }

  }


  return (

    <UserContext.Provider value={{ user, setUser, fetchGetUser }}>
      {children}
    </UserContext.Provider>

  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUserContext must be used within a UserProvider');
  return context;
};
