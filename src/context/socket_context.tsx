// Tạo WebSocket context
"use client"
import React, { createContext, useContext, useEffect, useRef,ReactNode, useState } from 'react';
import Stomp from "stompjs"
import SockJS from 'sockjs-client'
import API from '@/api/api';
import cookie from "js-cookie";
interface SocketContextType {
    subscribe: (destination: string, callback: (message: any) => void) => void;
    stompClient: any
 }
  

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => { 
   
 

    const isConnectedRef = useRef<any>(false);
    const [stompClient, setStompClient] = useState<any>(null)


    useEffect(() => {
      
        if (isConnectedRef.current) return;

        const socket = new SockJS(`${API.NOTI.NOTI_SOCKET}?ss=${cookie.get("session-id")}`)
        const client = Stomp.over(socket)
        client.connect({
        }, () => {
            isConnectedRef.current = true;
            console.log("connect success")
        })
        setStompClient (client)
        
        return () => {
            if (stompClient) {
                client.disconnect(() => {
                    isConnectedRef.current = false;
                    console.log('Disconnected');
                });
            }
        };
    },[])

    
    const subscribe = (destination: string, callback: (message: any) => void) => {
    
      if ( isConnectedRef.current) {
            stompClient.subscribe(destination, callback);
            console.log('subscribe');
        } else {
          console.log('WebSocket is not connected.');
        }
      };

      return (
        <SocketContext.Provider value={{ subscribe,stompClient }}>
          {children}
        </SocketContext.Provider>
      );

};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocketContext must be used within a SocketProvider');
  return context;
};
  