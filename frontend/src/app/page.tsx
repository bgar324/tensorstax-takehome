"use client";
import { useWebSocket } from "../lib/useWebSocket";
import { useEffect, useState } from "react"; // state and lifecycle hooks
import Image from "next/image";

// defines the expected shape of messages received from the backend
interface Message {
  timestamp: string;
  type: "status" | "notification" | "activity";
  content: string;
}

export default function HomePage() {
  const [isLive, setIsLive] = useState(false); // toggle for whether the live feed is active (or not)
  const raw = useWebSocket(process.env.NEXT_PUBLIC_WS_URL!, isLive); // hook that returns the latest raw JSON string from the websocket
  const [messages, setMessages] = useState<Message[]>([]); // stores parsed messages (up to 20)
  const [cooldown, setCooldown] = useState(false); // prevents button spam by locking interactions for 1 second

  // parses raw message and update message list for when new data arrives
  useEffect(() => {
    if (raw) {
      const parsed: Message = JSON.parse(raw);
      setMessages((prev) => [parsed, ...prev.slice(0, 19)]); // prepends the newest message to the front (index 0) and keeps the array capped at 20
      // enqueue at the front, implicitly drop from the back. therefore: messages[0] = newest message.
    }
  }, [raw]);

  // toggles live feed on/off with cooldown guard
  const toggleFeed = () => {
    if (cooldown) return;
    setCooldown(true);
    setIsLive((prev) => !prev);
    setTimeout(() => setCooldown(false), 1000);
  };

  // gets the timestamp of the most recent message
  const latestTimestamp = messages[0]?.timestamp;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="items-center justify-center text-center flex gap-6 border-b-2 border-gray-400 rounded-b-[64px] border-2 min-w-4xl mx-auto border-t-0">
        <div className="flex flex-row gap-6 px-12 py-6">
          <Image
            src="/static/tensorstax.svg"
            width={300}
            height={300}
            alt="Tensorstax logo"
          />
          <h1 className="digitag-text text-5xl tracking-widest">
            take home project!
          </h1>
        </div>
      </header>
      {/* feed control */}
      <div className="sticky top-0 z-30 flex justify-center w-full py-4 bg-transparent">
        <div className="rounded-full shadow-lg px-8 py-3 flex flex-row items-center gap-6 bg-white border border-gray-200">
          <button
            onClick={toggleFeed}
            disabled={cooldown}
            className={`py-2 px-6 rounded-full cursor-pointer transition-all duration-150 font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${
              isLive ? "bg-red-500" : "bg-blue-500"
            } hover:opacity-90 ${
              cooldown ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLive ? "Stop Feed" : "Start Feed"}
          </button>
          <button
            onClick={() => {
              setIsLive(false);
              setMessages([]);
              setCooldown(false);
            }}
            className="py-2 px-6 rounded-full cursor-pointer bg-gray-400 text-white hover:bg-gray-500 font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 duration-150 "
          >
            Reset
          </button>
        </div>
      </div>
      {/* Section 1: Latest Messages Stacked */}
      <main className="flex flex-row mx-auto">
        <div className="p-6 flex justify-center items-start">
          <div className="max-w-2xl w-full border-2 border-gray-400 rounded-lg overflow-hidden p-4 flex flex-row gap-4">
            <div className="w-full p-4 text-left border-2 border-gray-300 rounded-xl">
              <div className="justify-between text-center items-center flex flex-row gap-2 mb-4 border-b-1 border-gray-400">
                <h1 className="text-xl font-semibold">Live Feed</h1>
                <p className="text-sm">
                  {latestTimestamp
                    ? `last updated: ${new Date(latestTimestamp).toLocaleString(
                        "en-US",
                        { timeZone: "America/Los_Angeles" }
                      )}`
                    : "no updates yet"}
                </p>
              </div>
              <h2 className="text-lg font-semibold mb-2">
                Latest Message Stacked
              </h2>
              {/* unordered list container with vertical spacing between items */}
              <ul className="space-y-2 mb-8">
                {/* loop over the full message array, newest first due to prepending */}
                {/* each message renders as a data card in real-time order */}
                {messages.map((msg, idx) => {
                  let icon = "";
                  let border = "";
                  let bg = "";
                  let text = "";
                  // assigns styling and emoji based on message type
                  if (msg.type === "status") {
                    icon = "🧭";
                    border = "border-green-300";
                    bg = "bg-green-100";
                    text = "text-green-900";
                  } else if (msg.type === "notification") {
                    icon = "🔔";
                    border = "border-yellow-300";
                    bg = "bg-yellow-100";
                    text = "text-yellow-900";
                  } else if (msg.type === "activity") {
                    icon = "📘";
                    border = "border-blue-300";
                    bg = "bg-blue-100";
                    text = "text-blue-900";
                  }

                  return (
                    <li
                      key={idx}
                      className={`flex items-center justify-between border-2 ${border} ${bg} ${text} p-4 rounded-lg shadow-md`}
                    >
                      <div>
                        <h1 className="font-semibold text-base capitalize">
                          {icon} {msg.type}
                        </h1>
                        <p className="text-sm ml-7">{msg.content}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
        {/* Section 2: Latest Message Only */}
        <div className="p-6 flex justify-center items-start">
          <div className="max-w-2xl w-full border-2 border-gray-400 rounded-lg overflow-hidden p-4 flex flex-row gap-4">
            <div className="w-full p-4 text-left border-2 border-gray-300 rounded-xl">
              <div className="justify-between text-center items-center flex flex-row gap-2 mb-4 border-b-1 border-gray-400">
                <h1 className="text-xl font-semibold">Live Feed</h1>
                <p className="text-sm">
                  {" "}
                  {latestTimestamp
                    ? `last updated: ${new Date(
                        latestTimestamp
                      ).toLocaleString()}`
                    : "no updates yet"}
                </p>
              </div>
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-2">
                  Latest Message Only
                </h2>
                <ul>
                  {/* getting the first message  */}
                  {messages[0] &&
                    // use an immediately invoked function expression (IIFE) to run logic (choose styles/icons) before returning JSX
                    //jsx doesnt support if / let statements inside the return block. acting like an inline function scope
                    (() => {
                      const msg = messages[0];
                      let icon = "";
                      let border = "";
                      let bg = "";
                      let text = "";
                      if (msg.type === "status") {
                        icon = "🧭";
                        border = "border-green-300";
                        bg = "bg-green-100";
                        text = "text-green-900";
                      } else if (msg.type === "notification") {
                        icon = "🔔";
                        border = "border-yellow-300";
                        bg = "bg-yellow-100";
                        text = "text-yellow-900";
                      } else if (msg.type === "activity") {
                        icon = "📘";
                        border = "border-blue-300";
                        bg = "bg-blue-100";
                        text = "text-blue-900";
                      }
                      return (
                        <li
                          className={`flex items-center justify-between border-2 ${border} ${bg} ${text} p-4 rounded-lg shadow-md`}
                        >
                          <div>
                            <h1 className="font-semibold text-base capitalize">
                              {icon} {msg.type}
                            </h1>
                            <p className="text-sm ml-7">{msg.content}</p>
                          </div>
                        </li>
                      );
                    })()}
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* Section 3: Latest Message Per Type */}
        <div className="p-6 flex justify-center items-start">
          <div className="max-w-2xl w-full border-2 border-gray-400 rounded-lg overflow-hidden p-4 flex flex-row gap-4">
            <div className="w-full p-4 text-left border-2 border-gray-300 rounded-xl">
              <div className="justify-between text-center items-center flex flex-row gap-2 mb-4 border-b-1 border-gray-400">
                <h1 className="text-xl font-semibold">Live Feed</h1>
                <p className="text-sm">
                  {" "}
                  {latestTimestamp
                    ? `last updated: ${new Date(
                        latestTimestamp
                      ).toLocaleString()}`
                    : "no updates yet"}
                </p>
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2">Latest by Type</h2>
                <ul className="space-y-2">
                  {/* looping through the three expected types */}
                  {["status", "notification", "activity"].map((type) => {
                    // search for the first message that matches the current type. because messages are prepended, this is a fast lookup.
                    const latestOfType = messages.find(
                      (msg) => msg.type === type
                    );
                    // if nothing has been received yet, display a disabled card saying that.
                    if (!latestOfType)
                      return (
                        <li
                          key={type}
                          className="border-2 border-gray-200 bg-gray-50 text-gray-400 p-4 rounded-lg shadow-md"
                        >
                          <div>
                            <h1 className="font-semibold text-base capitalize">
                              {type}
                            </h1>
                            <p className="text-sm ml-7">No message yet</p>
                          </div>
                        </li>
                      );
                    let icon = "";
                    let border = "";
                    let bg = "";
                    let text = "";
                    if (type === "status") {
                      icon = "🧭";
                      border = "border-green-300";
                      bg = "bg-green-100";
                      text = "text-green-900";
                    } else if (type === "notification") {
                      icon = "🔔";
                      border = "border-yellow-300";
                      bg = "bg-yellow-100";
                      text = "text-yellow-900";
                    } else if (type === "activity") {
                      icon = "📘";
                      border = "border-blue-300";
                      bg = "bg-blue-100";
                      text = "text-blue-900";
                    }
                    return (
                      <li
                        key={type}
                        className={`flex items-center justify-between border-2 ${border} ${bg} ${text} p-4 rounded-lg shadow-md`}
                      >
                        <div>
                          <h1 className="font-semibold text-base capitalize">
                            {icon} {type}
                          </h1>
                          <p className="text-sm ml-7">{latestOfType.content}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
