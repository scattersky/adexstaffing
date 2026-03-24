'use client';

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  verifyPasswordResetCode,
  confirmPasswordReset,
  updatePassword,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [oobCode, setOobCode] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPasswordInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [validCode, setValidCode] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  // Detect logged-in user
  useEffect(() => {
    if (auth.currentUser) setLoggedIn(true);
  }, []);

  // Read oobCode safely on client
  useEffect(() => {
    const code = searchParams.get("oobCode");
    if (code) setOobCode(code);
  }, [searchParams]);

  // Validate reset code
  useEffect(() => {
    if (!oobCode) return;

    verifyPasswordResetCode(auth, oobCode)
      .then(() => setValidCode(true))
      .catch(() => setError("Invalid or expired reset link."));
  }, [oobCode]);

  const handlePasswordChange = async () => {
    if (!password || !confirmPassword) {
      setError("Please fill out both fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (loggedIn) {
        await updatePassword(auth.currentUser!, password);
        setMessage("Password updated successfully!");
      } else if (oobCode) {
        await confirmPasswordReset(auth, oobCode, password);
        setMessage("Password reset successful! Redirecting...");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError("No valid session or reset code found.");
      }
    } catch (err: any) {
      if (err.code === "auth/weak-password") {
        setError("Password must be at least 6 characters.");
      } else if (err.code === "auth/requires-recent-login") {
        setError(
          "Please log out and log in again to change your password."
        );
      } else {
        setError("Failed to update password.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!oobCode && !loggedIn && !error) {
    return <p className="text-center mt-10">Validating reset link...</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold">
          {loggedIn ? "Change Password" : "Reset Password"}
        </h2>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {message && <p className="text-green-600 text-sm">{message}</p>}

        {(validCode || loggedIn) && (
          <>
            <input
              type="password"
              placeholder="New Password"
              className="border p-2 w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="border p-2 w-full"
              value={confirmPassword}
              onChange={(e) => setConfirmPasswordInput(e.target.value)}
            />
            <button
              onClick={handlePasswordChange}
              disabled={loading}
              className="w-full bg-red-700 text-white py-2 rounded disabled:opacity-50"
            >
              {loading
                ? loggedIn
                  ? "Updating..."
                  : "Resetting..."
                : loggedIn
                  ? "Change Password"
                  : "Reset Password"}
            </button>
          </>
        )}

        {!oobCode && !loggedIn && !error && (
          <p className="text-gray-500 text-sm">
            No reset code provided and no user logged in.
          </p>
        )}
      </div>
    </div>
  );
}