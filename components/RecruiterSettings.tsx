'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import EmailNotificationToggle from "@/components/EmailNotificationToggle";

interface UserProfile {
  id: number;
  firebase_uid: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  specialty: string;
  years_experience: string;
}


export default function RecruiterSettings() {
  const { user, role, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    axios
      .get("https://adextravelnursing.com/api_get_user.php", {
        params: { uid: user.uid }
      })
      .then((response) => {
        setUserData(response.data);

      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);


  return (
    <div className="flex flex-col gap-2 w-full">

      <EmailNotificationToggle />
      <hr className='bg-gray-800 h-0.5 my-2 opacity-20 w-full'/>
      <div className="flex flex-col gap-2 w-full">

        <Link href="/resetpassword" className="bg-red-700 px-4 py-2 rounded-md max-w-40 text-center">
          <span className="text-sm font-medium text-white">Reset Password</span>
        </Link>
      </div>

    </div>
  );
}