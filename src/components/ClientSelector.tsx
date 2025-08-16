'use client';

import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Select } from '@mantine/core';
import { getApp } from "firebase/app"; // ✅

type Client = {
  id: string;
  name: string;
};

export default function ClientSelector({ onSelect }: { onSelect: (clientId: string) => void }) {
  const [clientOptions, setClientOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    console.log("📦 useEffect started");
  
    try {
      const app = getApp();
      console.log("✅ Firebase Project ID:", app.options.projectId);
    } catch (err) {
      console.error("❌ Firebase app not initialized", err);
      return;
    }
  
    const fetchClients = async () => {
      console.log("🚀 fetchClients started");
  
      try {
        const ref = collection(db, "clients");
        console.log("📚 Collection ref created:", ref.path);
  
        const snapshot = await getDocs(ref);
        console.log("📦 Snapshot received:", snapshot);
  
        if (snapshot.empty) {
          console.warn("⚠️ No documents in 'clients' collection");
        }

        console.log("snapshot.docs",snapshot.docs)
  
        const options = snapshot.docs.map(doc => {
          const data = doc.data();
          console.log("🔍 Client doc:", doc.id, data);
          if (!data.name) return null;
          return {
            value: doc.id,
            label: data.name,
          };
        }).filter(Boolean) as { value: string; label: string }[];
  
        console.log("✅ Fetched clients:", options);
        setClientOptions(options);
      } catch (err) {
        console.error("❌ Failed to fetch clients:", err.code, err.message);
      }
    };
  
    fetchClients();
  }, []);
  

  return (
    <Select
      data={clientOptions}
      placeholder="Select a client"
      clearable
      onChange={(value) => {
        if (value) onSelect(value);
      }}
      searchable
      nothingFoundMessage="No clients found"
      className="w-full"
    />
  );
}
