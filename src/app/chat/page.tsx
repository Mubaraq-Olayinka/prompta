'use client';
import { useState } from "react";
import ChatBox from "../../components/ChatBox";
import ClientSelector from "@/components/ClientSelector";
import { Button } from '@mantine/core';
import { LogOut } from "lucide-react";
import Logo from '@/assets/images/plainLogo.png';
import Image from "next/image";
import Link from "next/link";

export default function ChatPage() {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#f9f9f9] flex flex-col justify-between px-2 border-r border-gray-200">
        <div>
          <div className="">
            <Image src={Logo} alt="Logo" className="object-contain h-[50px] w-[50px]" />
          </div>
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Select Client</h2>
            <ClientSelector onSelect={(id) => setSelectedClient(id)} />
          </div>
        </div>

        <div className="p-4 border-t border-gray-200">
          <Link href={'#'} className="flex items-center gap-2">
            <LogOut />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
        <header className="p-6 bg-white border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Prompta</h2>
          {selectedClient && (
            <p className="text-sm text-gray-600">Prompting with: <strong>{selectedClient}</strong></p>
          )}
        </header>

        {selectedClient ? (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              <ChatBox clientId={selectedClient} />
            </div>
            {/* <footer className="p-4 bg-white shadow-inner"> */}
              {/* Assume message input is inside ChatBox or customize here */}
              {/* <p className="text-gray-500 text-sm">Type your message below...</p> */}
            {/* </footer> */}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <p>Select a client to start chatting</p>
          </div>
        )}
      </main>
    </div>
  );
}
