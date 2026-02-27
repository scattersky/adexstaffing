"use client";

import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Optional: redirect if already logged in
  useEffect(() => {
    if (auth.currentUser) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      // ✅ Ensure login persists after refresh
      await setPersistence(auth, browserLocalPersistence);

      await signInWithEmailAndPassword(auth, email, password);

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="w-1/2 flex flex-col justify-center items-center">
        <div className="max-w-md mx-auto mt-20 space-y-4 bg-white rounded-md shadow-sm p-5">
          <Image
            src="/adexlogo.webp"
            alt="logo"
            width={240}
            height={100}
            className="mx-auto mb-6"
          />

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

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="border border-red-700 bg-red-700 rounded-md text-white px-4 py-2 w-full disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>

      <div className="w-1/2 bg-[url('/hero.jpeg')] bg-cover bg-right h-screen"></div>
    </div>
  );
}