"use client"
import { createContext, useContext, useState, ReactNode } from 'react';

type UserContextType = {
  user: UserResponse|null;
  setUser: (value: UserResponse) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserResponse | null>(null);

  return (
    
    <UserContext.Provider value={{ user, setUser }}>
    {children}
  </UserContext.Provider>

  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUserContext must be used within a UserProvider');
  return context;
};
