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
import {FaEye, FaRegTrashAlt, FaUserCheck} from "react-icons/fa";
import {IoFileTrayFullOutline, IoPersonAdd} from "react-icons/io5";
import {MdGroups, MdNotificationsActive} from "react-icons/md";
import {AiOutlineSend} from "react-icons/ai";
import Select from "react-select";
import { MultiSelect } from "primereact/multiselect";
import {FaRegCalendarDays} from "react-icons/fa6";
import MyCalendar from "@/components/MyCalendar";
import {RiLogoutBoxLine} from "react-icons/ri";
import {signOut} from "firebase/auth";
import {auth} from "@/lib/firebase";
import RecruiterCandidatesList from "@/components/RecruiterCandidatesList";
import {Badge} from "primereact/badge";
import AdminCandidatesList from "@/components/AdminCandidatesList";
import AdminNotifications from "@/components/AdminNotifications";
import AdminRecruiters from "@/components/AdminRecruiters";


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
  const[savedJobs, setSavedJobs] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);

  const [notificationsVisible, setNotificationsVisible] = useState(true);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [candidatesVisible, setCandidatesVisible] = useState(false);
  const [addCandidateVisible, setAddCandidateVisible] = useState(false);
  const [savedJobsVisible, setSavedJobsVisible] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [recruitersVisible, setRecruitersVisible] = useState(false);



  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading]);

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

  const fetchCandidates = async () => {
    if (!user) return;

    try {
      const res = await axios.get(
        "https://adextravelnursing.com/api_get_candidates.php",
        { params: { uid: user.uid } }
      );

      setCandidates(Array.isArray(res.data) ? res.data : [res.data]);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchCandidates();
  }, [user]);




  const fetchSavedJobs = async () => {
    if (!user) return;
    axios
      .get("https://adextravelnursing.com/api_dashboard_get_saved_jobs.php", {
        params: { firebase_uid: user.uid }
      })
      .then((res) => {
        console.log("Saved jobs API:", res.data);
        setSavedJobs(Array.isArray(res.data) ? res.data : []);
      });
  }
  useEffect(() => {
    fetchSavedJobs();
  }, [user?.uid]);

  const toastJobRemoved = () => toast.error('Job Removed!', {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Slide,
  });

  const handleUnsaveJob = async (job_id: any) => {
    if (!user) return;
    await axios.post(
      "https://adextravelnursing.com/api_unsave_job.php",
      {
        firebase_uid: user?.uid,
        job_id: job_id
      }
    )
      .then((res) => {
        toastJobRemoved();
        console.log("Saved jobs API:", res.data);
        fetchSavedJobs();
      });
  }

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleNotificationsVisibility = () => {
    setNotificationsVisible(true)
    setCandidatesVisible(false)
    setSettingsVisible(false);
    setAddCandidateVisible(false);
    setSavedJobsVisible(false);
    setCalendarVisible(false);
    setRecruitersVisible(false);
  }
  const handleSettingsVisibility = () => {
    setNotificationsVisible(false)
    setCandidatesVisible(false)
    setSettingsVisible(true);
    setAddCandidateVisible(false);
    setSavedJobsVisible(false);
    setCalendarVisible(false);
    setRecruitersVisible(false);
  }
  const handleCandidatesVisibility = () => {
    setNotificationsVisible(false)
    setCandidatesVisible(true)
    setSettingsVisible(false);
    setAddCandidateVisible(false);
    setSavedJobsVisible(false);
    setCalendarVisible(false);
    setRecruitersVisible(false);
  }

  const handleSavedJobsVisibility = () => {
    setNotificationsVisible(false)
    setCandidatesVisible(false)
    setSettingsVisible(false);
    setAddCandidateVisible(false);
    setSavedJobsVisible(true);
    setCalendarVisible(false);
    setRecruitersVisible(false);
  }
  const handleCalendarVisibility = () => {
    setNotificationsVisible(false)
    setCandidatesVisible(false)
    setSettingsVisible(false);
    setAddCandidateVisible(false);
    setSavedJobsVisible(false);
    setCalendarVisible(true);
    setRecruitersVisible(false);
  }
  const handleRecruitersVisibility = () => {
    setNotificationsVisible(false)
    setCandidatesVisible(false)
    setSettingsVisible(false);
    setAddCandidateVisible(false);
    setSavedJobsVisible(false);
    setCalendarVisible(false);
    setRecruitersVisible(true);
  }

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-red-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>


      <div className="bg-gray-100 h-full">
        <section className="max-w-full mx-auto h-full">
          <div className="flex justify-start items-start flex-wrap md:flex-nowrap relative">

            {/*DASHBOARD LEFT*/}
            <div className="flex flex-col items-start justify-between gap-2 bg-[#222] p-6 w-full md:w-[20%] min-w-70 max-w-70 h-full min-h-screen absolute" >
              <div className=" w-full">
                <div className=" w-full px-2 mt-6">
                  <h3 className="text-white text-lg font-normal mb-0">
                    Welcome,
                  </h3>
                  <h3 className="text-white text-2xl font-black mb-1">
                    {userData?.first_name} {userData?.last_name}
                  </h3>
                  <Badge value="ADMIN" severity="warning" className='uppercase tracking-widest mb-6'></Badge>
                </div>


                <hr className='bg-white w-full h-0.5 mb-1 opacity-10'/>
                <div className="flex flex-col items-start justify-start gap-2 pt-5">
                  <button
                    onClick={handleNotificationsVisibility}
                    className={`flex items-center justify-start gap-1 w-full px-0 py-2 rounded-md transition cursor-pointer text-[12px] font-medium duration-700 text-white pl-2  hover:bg-linear-to-br hover:from-sky-800 hover:to-sky-950 ${
                      notificationsVisible
                        ? "bg-linear-to-br from-sky-800 to-sky-950"
                        : ""
                    }`}
                  >
                    <MdNotificationsActive  size={16} className=""/>
                    <span>Notifications</span>
                  </button>
                  <button
                    onClick={handleRecruitersVisibility}
                    className={`flex items-center justify-start gap-1 w-full px-0 py-2 rounded-md transition cursor-pointer text-[12px] font-medium duration-700 text-white pl-2  hover:bg-linear-to-br hover:from-sky-800 hover:to-sky-950 ${
                      recruitersVisible
                        ? "bg-linear-to-br from-sky-800 to-sky-950"
                        : ""
                    }`}
                  >
                    <MdGroups  size={16} className=""/>
                    <span>All Recruiters</span>
                  </button>
                  <button
                    onClick={handleCandidatesVisibility}
                    className={`flex items-center justify-start gap-1 w-full px-0 py-2 rounded-md transition cursor-pointer text-[12px] font-medium duration-700 text-white pl-2  hover:bg-linear-to-br hover:from-sky-800 hover:to-sky-950 ${
                      candidatesVisible
                        ? "bg-linear-to-br from-sky-800 to-sky-950"
                        : ""
                    }`}
                  >
                    <MdGroups  size={16} className=""/>
                    <span>All Candidates</span>
                  </button>

                  <button
                    onClick={handleCalendarVisibility}
                    className={`flex items-center justify-start gap-1 w-full px-0 py-2 rounded-md transition cursor-pointer text-[12px] font-medium duration-700 text-white pl-2  hover:bg-linear-to-br hover:from-sky-800 hover:to-sky-950 ${
                      calendarVisible
                        ? "bg-linear-to-br from-sky-800 to-sky-950"
                        : ""
                    }`}>
                    <FaRegCalendarDays  size={16} className=""/>
                    <span>Calendar</span>
                  </button>
                  <button
                    onClick={handleSettingsVisibility}
                    className={`flex items-center justify-start gap-1 w-full px-0 py-2 rounded-md transition cursor-pointer text-[12px] font-medium duration-700 text-white pl-2  hover:bg-linear-to-br hover:from-sky-800 hover:to-sky-950 ${
                      settingsVisible
                        ? "bg-linear-to-br from-sky-800 to-sky-950"
                        : ""
                    }`}>
                    <PiGear  size={16} className=""/>
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-start gap-1 w-full stext-center  pl-2 py-2 rounded-md transition cursor-pointer text-[12px] font-medium duration-700 text-white  hover:border-red-600 hover:bg-linear-to-br hover:from-red-600 hover:to-red-900">
                    <RiLogoutBoxLine  size={16} className=""/>
                    <span>Logout</span>
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

            <div className="flex flex-col items-start justify-start gap-4 mx-auto  w-full h-full min-h-screen pl-70" >
              <div className=' bg-sky-900 py-4 px-8 w-full'>
                <h1 className='text-white text-sm tracking-wide font-normal uppercase mt-1'>Dashboard</h1>
                <h3 className='text-white text-2xl font-bold'>
                  {notificationsVisible ? "Notifications" : ""}
                  {candidatesVisible ? "My Candidates" : ""}

                  {savedJobsVisible ? "My Saved Jobs" : ""}
                  {calendarVisible ? "Calendar" : ""}
                  {settingsVisible ? "Settings" : ""}
                </h3>
              </div>
              <div className='p-8 w-full'>

                {/*PANEL: NOTIFICATIONS */}
                {notificationsVisible && (
                  <div className="flex flex-col items-start justify-start gap-2 bg-white rounded-lg p-4 shadow-lg w-full">
                    <AdminNotifications />
                  </div>
                )}

                {/*PANEL: RECRUITERS*/}
                {recruitersVisible && (
                  <div className="flex flex-col items-start justify-start gap-2 bg-white rounded-lg p-4 shadow-lg w-full">
                  <AdminRecruiters />
                  </div>
                )}

                {/*PANEL: CANDIDATES*/}
                {candidatesVisible && (
                  <div className="flex flex-col items-start justify-start gap-2 bg-white rounded-lg p-4 shadow-lg w-full">
                    <AdminCandidatesList />
                  </div>
                )}



                {/*PANEL: CALENDAR */}
                {calendarVisible && (
                  <div className="flex flex-col items-start justify-start gap-2 bg-white rounded-lg p-4 shadow-lg w-full">

                    <MyCalendar />
                  </div>
                )}

                {/*PANEL: SETTINGS */}
                {settingsVisible && (
                  <div className="flex flex-col items-start justify-start gap-2 bg-white rounded-lg p-4 shadow-lg w-full">

                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
      <ToastContainer/>
    </div>
  );
}