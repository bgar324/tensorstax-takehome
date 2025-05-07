import { useEffect, useRef, useState } from "react";

//custom hook to manage websocket connection

export function useWebSocket(url: string, enabled: boolean) {
  //keeps the actual websocket object consistent, and a persistent reference throughout lifetime
  const socketRef = useRef<WebSocket | null>(null);

  //state to hold the most recent message from the server
  const [latestMessage, setLatestMessage] = useState<string | null>(null);

  //lifecycle hook: runs when url or enabled changes
  useEffect(() => {

    //if the feed isn't enabled, exit early (dont open a new socket!!)
    if (!enabled) return;
    
    //create a new websocket connection to the provided url (only reachable if feed is enabled)
    socketRef.current = new WebSocket(url);

    //message received
    socketRef.current.onmessage = (event) => {
      //only process msg if connection is open
      if (socketRef.current?.readyState === 1) { //another guardrail, essentially preventing to set the newest data until the readyState is ACTUALLY ready. in testing, if i mashed it, then and it wouldnt be ready, data would still output, and leak out
        setLatestMessage(event.data);
      }
    };

    // more production stuff, just logging the errors & seeing whats happening
    socketRef.current.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    // prod: log when socket is closed
    socketRef.current.onclose = (e) => {
      console.warn("WebSocket closed:", e);
    };


    //CLEANUP! close socket when component unmounts, or its dependencies change
    return () => {
      socketRef.current?.close();
    };
  }, [url, enabled]); //rerun effect if url or enabled flag changes
  
  //even if it is hypothetically closed, we want it all out of the socket. #nodataleftbehind
  return latestMessage;
}

//receives from main.py and sends it to page.tsx