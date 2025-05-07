"use client";
import { useWebSocket } from "../lib/useWebSocket";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Message {
  timestamp: string;
  type: "status" | "notification" | "activity";
  content: string;
}

export default function HomePage() {
  const [isLive, setIsLive] = useState(false);
  const raw = useWebSocket("ws://localhost:8000/ws", isLive);
  const [messages, setMessages] = useState<Message[]>([]);
  const [cooldown, setCooldown] = useState(false);

  useEffect(() => {
    if (raw) {
      const parsed: Message = JSON.parse(raw);
      setMessages((prev) => [parsed, ...prev.slice(0, 19)]);
    }
  }, [raw]);

  const toggleFeed = () => {
    if (cooldown) return;
    setCooldown(true);
    setIsLive((prev) => !prev);
    setTimeout(() => setCooldown(false), 1000);
  };

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

      <main className="flex flex-row mx-auto">
        <div className="p-6 flex justify-center items-start">
          <div className="max-w-2xl w-full border-2 border-gray-400 rounded-lg overflow-hidden p-4 flex flex-row gap-4">
            <div className="w-full p-4 text-left border-2 border-gray-300 rounded-xl">
              <div className="justify-between text-center items-center flex flex-row gap-2 mb-4 border-b-1 border-gray-400">
                <h1 className="text-xl font-semibold">Live Feed</h1>
                <p className="text-sm">
                  {" "}
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
              <ul className="space-y-2 mb-8">
                {messages.map((msg, idx) => {
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
                  {messages[0] &&
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
                  {["status", "notification", "activity"].map((type) => {
                    const latestOfType = messages.find(
                      (msg) => msg.type === type
                    );
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
