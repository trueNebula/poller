import type { Message } from "@/lib/types";
import { SOCKET_URL } from "@/lib/utils";
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react";
import useWebSocket from "react-use-websocket";

interface ContextType {
  sendJsonMessage: <T = unknown>(jsonMessage: T, keep?: boolean) => void;
  lastJsonMessage: unknown;
  messageHistory: Message[];
}

const contextDefaults = {
  sendJsonMessage: () => {},
  lastJsonMessage: null,
  messageHistory: [],
}

const WSContext = createContext<ContextType>(contextDefaults);

export function WSProvider({ children }: PropsWithChildren) {
  const [messageHistory, setMessageHistory] = useState<Message[]>([]);
  
  const {sendJsonMessage, lastJsonMessage} = useWebSocket(SOCKET_URL, {
    onOpen: () => console.log('connected'),
    onClose: () => console.log('disconnected'),
    onError: (err) => console.error('error:', err),
    shouldReconnect: () => true,
  });

    useEffect(() => {
      if (lastJsonMessage !== null) {
        setMessageHistory((prev) => prev.concat(lastJsonMessage as Message));
      }
    }, [lastJsonMessage]);
  
    return (
      <WSContext.Provider value={{sendJsonMessage, messageHistory, lastJsonMessage}}>
        {children}
      </WSContext.Provider>
    )
}

export const useWs = () => useContext(WSContext);
