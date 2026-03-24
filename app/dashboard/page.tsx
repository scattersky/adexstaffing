"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {useEffect, useState} from "react";

export default function DashboardRouter() {
  const { role } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!role) {
      return;
    };

    if(role === 'admin' || role === 'recruiter' || role === 'candidate'){
      router.push(`/dashboard/${role}`);
    } else {
      router.push('/login');
    }

  }, [role]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-red-700 rounded-full animate-spin"></div>
      </div>
    );
  }
  return null;
}