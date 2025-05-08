import { useEffect, useRef, useState } from "react";

//custom hook to manage websocket connection

export function useWebSocket(url: string, enabled: boolean) {
  // persistent reference to the websocket instance, surviving re-renders
  const socketRef = useRef<WebSocket | null>(null);

  //state to hold the most recent raw message as a string
  const [latestMessage, setLatestMessage] = useState<string | null>(null);

  //lifecycle hook: runs whenever the 'url' or 'enabled' flag changes
  useEffect(() => {

    // guardrail: exit early if feed isn't enabled
    if (!enabled) return;
    
    // establish a new web socket connection
    socketRef.current = new WebSocket(url);

    // define behavior when message is received from the server
    socketRef.current.onmessage = (event) => {
      // only process msg if socket is open (1 === OPEN)
      if (socketRef.current?.readyState === 1) {
        setLatestMessage(event.data);
      }
    };

    // log any websocket errors to console for debugging
    socketRef.current.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    // log closure events (eg: manual disconnect, server shutdown)
    socketRef.current.onclose = (e) => {
      console.warn("WebSocket closed:", e);
    };


    // cleanup: close socket when component unmounts or dependencies change
    return () => {
      socketRef.current?.close();
    };
  }, [url, enabled]); // effect re-runs if URL or enabled state changes

  return latestMessage;
}

// purpose: connects to fastapi's /ws route and streams raw json strings to page.tsx