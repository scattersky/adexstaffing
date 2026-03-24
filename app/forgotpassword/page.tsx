'use client';

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    if (!email) {
      setError("Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await sendPasswordResetEmail(auth, email, {
        url: "https://jobs.adextravelnursing.com/resetpassword",
      });

      setMessage("Password reset email sent. Check your inbox.");
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        setError("No account found with that email.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else {
        setError("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold">Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="border p-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {message && <p className="text-green-600 text-sm">{message}</p>}

        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full bg-red-700 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Email"}
        </button>

        <Link href="/login" className="text-sm text-blue-600 hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
  );
}