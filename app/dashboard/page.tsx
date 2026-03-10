"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardRouter() {
  const { role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!role) return;

    router.push(`/dashboard/${role}`);
  }, [role]);

  return null;
}