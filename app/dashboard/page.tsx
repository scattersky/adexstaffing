'use client'
import { CometCard } from "@/components/ui/comet-card";
import Header from "@/app/sections/Header";
import InnerPageTitle from "@/app/sections/InnerPageTitle";
import moment from "moment/moment";
import {useEffect, useState} from "react";
import axios from "axios";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {useRouter} from "next/navigation";
import {useAuth} from "@/context/AuthContext";


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

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<UserProfile | null>(null);
const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  useEffect(() => {

    axios
      .get("https://adextravelnursing.com/api_get_user.php", {
        params: { uid: user?.uid }
      })
      .then((response) => {
        setUserData(response.data);
        console.log(userData);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-red-700 rounded-full animate-spin"></div>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-red-700 rounded-full animate-spin"></div>
      </div>
    );
  }
  return (
    <div>
      <Header />
      <InnerPageTitle title='Dashboard' />
      <div className="bg-gray-100 pt-2 pb-12">
        <section className="mt-12 max-w-5xl mx-auto md:px-8 h-screen">
          <div className="flex justify-between items-start gap-4">
            <div className="flex flex-col items-start justify-start gap-2 bg-white rounded-lg p-4 shadow-lg w-1/3" >
              <h3 className="text-gray-800 text-xl font-semibold">
                {userData?.first_name} {userData?.last_name}
              </h3>
            </div>
            <div className="flex flex-col items-start justify-start gap-4 w-2/3" >
              <div className="flex flex-col items-start justify-start gap-2 bg-white rounded-lg p-4 shadow-lg w-full" >
                <h3 className="text-gray-800 text-md font-semibold">
                  My Saved Jobs
                </h3>
              </div>
              <div className="flex flex-col items-start justify-start gap-2 bg-white rounded-lg p-4 shadow-lg w-full">
                <h3 className="text-gray-800 text-md font-semibold">
                  My Skills Checklists
                </h3>
              </div>
            </div>
          </div>


        </section>
      </div>
    </div>
  );
}