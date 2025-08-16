'use client';

import Mic from "@/assets/icons/Mic";
import { useRef, useState } from "react";

type Message = {
  sender: "user" | "llm";
  text: string;
};

export default function ChatBox({ clientId }: { clientId: string }) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    setChatHistory((prev) => [...prev, userMessage]);
    setInput("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // reset height
    }

    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client_id: clientId, message: input }),
      });

      const data = await res.json();
      const llmMessage: Message = { sender: "llm", text: data.response };
      setChatHistory((prev) => [...prev, llmMessage]);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        { sender: "llm", text: "❌ Error getting response." },
      ]);
    } finally {
      setLoading(false);

      // scroll to bottom smoothly
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Message Thread */}
      <div className="flex-1 w-full flex flex-col gap-[20px] items-center overflow-y-auto scrollbar-hide space-y-4 p-4 rounded-md max-w-[75%] self-center">
        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            className={`whitespace-pre-wrap break-words text-[14px] text-[#525866] leading-[20px] ${
              msg.sender === "user"
                ? "bg-blue-600 text-white self-end h-auto rounded-[18px] px-[10px] py-1.5 w-auto flex self-end"
                : "bg-transparent text-gray-800 self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <div className="text-sm self-start text-gray-500">
            AI is thinking...
          </div>
        )}

        {/* bottom anchor for auto-scroll */}
        <div ref={bottomRef} />
      </div>

      {/* Message Input */}
      <div className="mt-auto max-w-[75%] self-center w-full">
        <div className="flex flex-col bg-transparent rounded-[12px] pb-[8px] w-full border border-[#E2E4E9] gap-[28px]">
          <textarea
            ref={textareaRef}
            placeholder="Message Prompta"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              const el = e.target;
              el.style.height = "auto";
              el.style.height = `${Math.min(el.scrollHeight, 500)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            className="w-full bg-transparent text-[#868C98] leading-[20px] placeholder:text-[#868C98] text-[14px] focus:outline-none resize-none overflow-y-auto max-h-[200px] pt-[16px] pl-[16px]"
            rows={1}
          />

          <div className="flex items-center justify-end pl-[16px] pr-[10px]">
            <div className="flex gap-1 justify-end">
              <button
                onClick={sendMessage}
                className="ml-2 h-7 w-7 min-w-[28px] min-h-[28px] rounded-full bg-blue-600 hover:bg-blue-800 flex items-center justify-center transition"
              >
                <span className="text-white text-xs text-[#CDD0D5]">↑</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
