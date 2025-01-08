// Tạo WebSocket context
"use client"
import React, { createContext, useContext, useEffect, useRef, ReactNode, useState } from 'react';
import Stomp from "stompjs"
import SockJS from 'sockjs-client'
import API from '@/api/api';
import cookie from "js-cookie";
interface SocketContextType {
  subscribe: (destination: string, callback: (message: any) => void) => void;
  disconnect : () => void
}


const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {



  const [stompClient, setStompClient] = useState<any>(null)

  const subscriptionQueue: { destination: string, callback: (message: any) => void }[] = [];
  useEffect(() => {
    console.log("session-id >>> ", cookie.get("session-id") )
    
    if (stompClient) return;
    if (cookie.get("session-id") === undefined) return;
    
    const socket = new SockJS(`${API.NOTI.NOTI_SOCKET}?ss=${cookie.get("session-id")}`);
    const client = Stomp.over(socket);
    client.connect({}, () => {
      console.log("Connect success");
      
      // Thực hiện các subscription từ hàng đợi khi kết nối thành công
      subscriptionQueue.forEach(({ destination, callback }) => {
        client.subscribe(destination, callback);
      });
      subscriptionQueue.length = 0; // Xóa các subscription đã thực hiện
    });
  
    setStompClient(client);
    console.log("session-id >>> ")

    return () => {
      if (stompClient) {
        client.disconnect(() => {
      
          setStompClient(null)
          console.log('Disconnected');
        });
      }
    };
  }, [cookie.get("session-id")]);

  const subscribe = (destination: string, callback: (message: any) => void) => {
    if (stompClient ) {
      stompClient.subscribe(destination, callback);
    } else {
      // Nếu chưa kết nối, thêm vào hàng đợi
      subscriptionQueue.push({ destination, callback });
    }
  };

  const disconnect = () => {
    if (stompClient) {
      stompClient.disconnect(() => {
        setStompClient(null)
        console.log('Disconnected');
      });
    }
  };



  return (
    <SocketContext.Provider value={{ subscribe,disconnect }}>
      {children}
    </SocketContext.Provider>
  );

};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocketContext must be used within a SocketProvider');
  return context;
};
