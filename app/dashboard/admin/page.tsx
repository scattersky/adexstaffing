'use client'
import InnerPageTitle from "@/app/sections/InnerPageTitle";
import moment from "moment/moment";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {useRouter} from "next/navigation";
import {useAuth} from "@/context/AuthContext";
import {PiGear, PiListChecksBold, PiReadCvLogoBold} from "react-icons/pi";
import {ImLifebuoy} from "react-icons/im";
import {ToastContainer, toast, Slide} from 'react-toastify';
import Link from "next/link";


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

export default function AdminDashboard() {
  const { user, role,  loading: authLoading } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [settingsVisible, setSettingsVisible] = useState(false);

  // useEffect(() => {
  //   if (role && role !== "admin") {
  //     router.push("/dashboard");
  //   }
  // }, [role]);
  //
  // if (role !== "admin") return null;



  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

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
  }, [user?.uid]);




  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-red-700 rounded-full animate-spin"></div>
      </div>
    );
  }



  const handleSettingsVisibility = () => {

    setSettingsVisible(true);
  }

  return (
    <div>
      <InnerPageTitle title='Dashboard' subHeading='Recruiter' />
      <div className="bg-gray-100 pt-2 pb-12">
        <section className="mt-12 max-w-7xl mx-auto md:px-8 min-h-screen">
          <div className="flex justify-between items-start gap-4 flex-wrap md:flex-nowrap px-4 md:px-0">

            {/*DASHBOARD LEFT*/}
            <div className="flex flex-col items-start justify-between gap-2 bg-white rounded-lg p-6 shadow-lg w-full md:w-[20%] h-full md:h-140" >
              <div className=" w-full">
                <h3 className="text-gray-800 text-xl font-semibold mb-2">
                  {userData?.first_name} {userData?.last_name}
                </h3>
                <hr className='bg-black w-full h-0.5 mb-3 opacity-20'/>
                <div className="flex flex-col items-start justify-start gap-1 mb-2">
                  <p className="text-gray-700 text-xs font-bold">
                    {userData?.specialty}
                  </p>
                  <p className="text-gray-700 text-xs">
                    <span className='font-bold'>Experience: </span> {userData?.years_experience}
                  </p>
                </div>
                <div className="flex flex-col items-start justify-start gap-1 mb-3">
                  <p className="text-gray-700 text-xs">
                    {userData?.email}
                  </p>
                  <p className="text-gray-700 text-xs">
                    {userData?.phone}
                  </p>
                </div>
                <hr className='bg-black w-full h-0.5 mb-1 opacity-20'/>
                <div className="flex flex-col items-start justify-start gap-2 pt-5">

                  <button
                    onClick={handleSettingsVisibility}
                    className="flex items-center justify-start gap-1 w-full stext-center px-4 py-1 rounded-md transition cursor-pointer text-[12px] font-medium duration-700 text-white border border-sky-800 hover:border-sky-700 hover:bg-sky-700 bg-sky-800">
                    <PiGear  size={16} className=""/>
                    <span>Settings</span>
                  </button>
                </div>
              </div>
              <div className="mt-3">
                <Link href='contact/' className='w-full flex items-start justify-start gap-1 text-xs  text-blue-900 rounded-lg  transition cursor-pointer'>
                  <ImLifebuoy size={18} className="text-blue-900"/>
                  <span>Need Help?</span>
                </Link>

              </div>
            </div>

            {/*DASHBOARD RIGHT*/}
            <div className="flex flex-col items-start justify-start gap-4 w-full md:w-[80%]" >




              {/*PANEL: SETTINGS */}
              {settingsVisible && (
                <div className="flex flex-col items-start justify-start gap-2 bg-white rounded-lg p-4 shadow-lg w-full">
                  <h3 className="text-gray-800 text-md font-black mb-2">
                    Settings
                  </h3>
                </div>
              )}

            </div>
          </div>


        </section>
      </div>
      <ToastContainer/>
    </div>
  );
}