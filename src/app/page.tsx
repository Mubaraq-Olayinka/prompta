'use client';

import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from '../assets/images/bigPlain.png';

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/chat");
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <main className="relative w-screen h-screen bg-white dark:bg-black transition-colors duration-300">
      <div className="w-full h-full flex justify-center items-center overflow-hidden relative">
        <Image src={Logo} alt="Logo" className="object-contain w-1/2 h-auto z-0" />
        {/* <div className="absolute w-full h-full flex justify-center items-center z-100">
          <button
            onClick={login}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition z-10"
          >
            Sign in with Google
          </button>
        </div> */}
        {/* Bottom section (blur or overlay based on mode) */}
        <div className="absolute max-w-[500px] w-full self-center max-h-[500px] h-full z-10">
          <div className="relative flex flex-col justify-center items-center w-full h-full p-8 text-black dark:text-white">

            {/* Light mode blur background */}
            <div
              className="absolute inset-0 z-[-1] dark:hidden rounded-[32px]"
              style={{
                background: `
                  linear-gradient(196.18deg, rgba(255,255,255,0.8) 6.16%, rgba(245,245,245,1) 88.75%)
                `,
                backdropFilter: "blur(5px)",
                WebkitBackdropFilter: "blur(5px)",
              }}
            />

            {/* Dark mode solid overlay — NO blur */}
            <div
              className="absolute inset-0 z-[-1] hidden dark:block rounded-[32px]"
              style={{
                background: `
                  linear-gradient(196.18deg, rgba(0,0,0,0.9) 6.16%, rgba(20,20,20,1) 88.75%)
                `,
              }}
            />

            {/* Optional content */}
                        
            <h1 className="text-2xl font-semibold mb-4 z-10">Welcome</h1>
            <button
              onClick={login}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition z-10"
            >
              Sign in with Google
            </button> 
           
          </div>
        </div>
      </div>
    </main>
  );
}
