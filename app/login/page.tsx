"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    await signInWithEmailAndPassword(auth, email, password);
    router.push("/dashboard");
  };

  return (
    <div className='flex justify-center items-center h-screen bg-gray-200'>
      <div className="w-1/2 h-ful flex flex-col justify-center items-center">
        <div className="max-w-md mx-auto mt-20 space-y-4 bg-white rounded-md shadow-sm p-5">
          <Image src="/adexlogo.webp" alt="logo" width={240} height={100} className='mx-auto mb-6'/>
          <input
            type="email"
            placeholder="Email"
            className="border p-2 w-full"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 w-full"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleLogin}
            className="border border-red-700 hover:border-red-600  bg-red-700 rounded-md hover:bg-red-600 duration-700 transition cursor-pointer  text-white px-4 py-2 w-full"
          >
            Login
          </button>
        </div>
      </div>
      <div className="w-1/2 h-ful flex flex-col justify-center items-center bg-[url('/hero.jpeg')] bg-cover bg-right h-screen">

      </div>
    </div>

  );
}