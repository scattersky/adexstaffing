"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardRouter() {
  const { user, role, loading } = useAuth(); // 👈 IMPORTANT: use loading from context
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // ⛔ wait for auth to resolve

    if (!user) {
      router.replace("/login");
      return;
    }

    if (role === "candidate") {
      router.replace("/dashboard/candidate");
    } else if (role === "recruiter") {
      router.replace("/dashboard/recruiter");
    } else {
      // fallback if role somehow missing
      router.replace("/login");
    }
  }, [user, role, loading, router]);

  // 🔥 Spinner while auth is loading
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-red-700 rounded-full animate-spin"></div>
    </div>
  );
}