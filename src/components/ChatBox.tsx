'use client';

import { useState } from "react";

type Message = {
  sender: 'user' | 'llm';
  text: string;
};

export default function ChatBox({ clientId }: { clientId: string }) {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: Message = { sender: "user", text: message };
    setChatHistory(prev => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client_id: clientId, message }),
      });

      const data = await res.json();
      const llmMessage: Message = { sender: "llm", text: data.response };
      setChatHistory(prev => [...prev, llmMessage]);
    } catch (err) {
      setChatHistory(prev => [...prev, { sender: "llm", text: "❌ Error getting response." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Message Thread */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-md">
        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[75%] p-3 rounded-xl ${
              msg.sender === "user"
                ? "bg-blue-600 text-white self-end"
                : "bg-gray-200 text-gray-800 self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <div className="text-sm text-gray-500">AI is thinking...</div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t flex items-center gap-2">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={2}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-md resize-none"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading || !message.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}
