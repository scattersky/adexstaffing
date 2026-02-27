'use client'
import Header from "@/app/sections/Header";
import InnerPageTitle from "@/app/sections/InnerPageTitle";
import moment from "moment/moment";
import {useEffect, useState} from "react";
import axios from "axios";
import {useRouter} from "next/navigation";
import {useAuth} from "@/context/AuthContext";
import {FaClipboardList, FaEye, FaRegTrashAlt} from "react-icons/fa";
import {PiGear, PiListChecksBold, PiReadCvLogoBold} from "react-icons/pi";
import {IoFileTrayFullOutline, IoSettingsSharp} from "react-icons/io5";
import {FaArrowUpRightFromSquare} from "react-icons/fa6";
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

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const[savedJobs, setSavedJobs] = useState<any[]>([]);

  const [savedJobsVisible, setSavedJobsVisible] = useState(true);
  const [myResumeVisible, setMyResumeVisible] = useState(false);
  const [skillsChecklistsVisible, setSkillsChecklistsVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);


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


  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-red-700 rounded-full animate-spin"></div>
      </div>
    );
  }

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

  const handleSavedJobsVisibility = () => {
    setSavedJobsVisible(true);
    setMyResumeVisible(false);
    setSkillsChecklistsVisible(false);
    setSettingsVisible(false);
  }
  const handleMyResumeVisibility = () => {
    setSavedJobsVisible(false);
    setMyResumeVisible(true);
    setSkillsChecklistsVisible(false);
    setSettingsVisible(false);
  }
  const handleSkillsChecklistsVisibility = () => {
    setSavedJobsVisible(false);
    setMyResumeVisible(false);
    setSkillsChecklistsVisible(true);
    setSettingsVisible(false);
  }
  const handleSettingsVisibility = () => {
    setSavedJobsVisible(false);
    setMyResumeVisible(false);
    setSkillsChecklistsVisible(false);
    setSettingsVisible(true);
  }

  return (
    <div>
      <InnerPageTitle title='Dashboard' subHeading='Manage' />
      <div className="bg-gray-100 pt-2 pb-12">
        <section className="mt-12 max-w-7xl mx-auto md:px-8 h-screen">
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
                    onClick={handleSavedJobsVisibility}
                    className="flex items-center justify-start gap-1 w-full stext-center px-4 py-1 rounded-md transition cursor-pointer text-[12px] font-medium duration-700 text-white border border-sky-800 hover:border-sky-700 hover:bg-sky-700 bg-sky-800">
                    <IoFileTrayFullOutline size={16} className=""/>
                    <span>Saved Jobs</span>
                  </button>
                  <button
                    onClick={handleMyResumeVisibility}
                    className="flex items-center justify-start gap-1 w-full stext-center px-4 py-1 rounded-md transition cursor-pointer text-[12px] font-medium duration-700 text-white border border-sky-800 hover:border-sky-700 hover:bg-sky-700 bg-sky-800">
                    <PiReadCvLogoBold size={16} className=""/>
                    <span>My Resume</span>
                  </button>
                  <button
                    onClick={handleSkillsChecklistsVisibility}
                    className="flex items-center justify-start gap-1 w-full stext-center px-4 py-1 rounded-md transition cursor-pointer text-[12px] font-medium duration-700 text-white border border-sky-800 hover:border-sky-700 hover:bg-sky-700 bg-sky-800">
                    <PiListChecksBold  size={16} className=""/>
                    <span>Skills Checklists</span>
                  </button>
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

              {/*PANEL: SAVED JOBS*/}
              {savedJobsVisible && (
                <div className="flex flex-col items-start justify-start gap-2 bg-white rounded-lg p-4 shadow-lg w-full">
                  <h3 className="text-gray-800 text-md font-black mb-2">
                    My Saved Jobs
                  </h3>
                  <div className="min-w-full">
                    <div
                      className="overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-none [&::-webkit-scrollbar-track]:bg-scrollbar-track [&::-webkit-scrollbar-thumb]:bg-scrollbar-thumb">
                      <table className="min-w-full divide-y divide-table-line">
                        <thead>
                        <tr>
                          <th scope="col"
                              className=" pr-2 py-3 text-start text-[10px] md:text-xs font-bold text-muted-foreground-1 uppercase">Job Title
                          </th>
                          <th scope="col"
                              className="py-3 pr-2 text-start text-[10px] md:text-xs font-bold text-muted-foreground-1 uppercase">Specialty
                          </th>
                          <th scope="col"
                              className="py-3 pr-2 text-start text-[10px] md:text-xs font-bold text-muted-foreground-1 uppercase">Location
                          </th>
                          <th scope="col"
                              className="hidden md:block py-3 pr-2 text-start text-[10px] md:text-xs font-bold text-muted-foreground-1 uppercase">Weekly
                          </th>
                          <th scope="col"
                              className="py-3 pr-2 text-start text-[10px] md:text-xs font-bold text-muted-foreground-1 uppercase">Posted
                          </th>
                          <th scope="col"
                              className="py-3 text-start text-[10px] md:text-xs font-bold text-muted-foreground-1 uppercase">Actions
                          </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-table-line">
                        {savedJobs.map((job: any) => (
                          <tr key={job.id}>
                            <td className="py-4 pr-1 whitespace-wrap md:whitespace-nowrap text-[10px] md:text-xs text-foreground">{job.job_title}</td>
                            <td className="py-4 pr-1 whitespace-wrap md:whitespace-nowrap  text-[10px] md:text-xs text-foreground">{job.job_specialty}</td>
                            <td className="py-4  pr-1 whitespace-wrap md:whitespace-nowrap  text-[10px] md:text-xs text-foreground">{job.job_city}, {job.job_city}</td>
                            <td className="hidden md:block py-4 whitespace-wrap md:whitespace-nowrap  text-[10px] md:text-xs text-foreground">{job.job_weekly_pay}</td>
                            <td className="py-4  whitespace-wrap md:whitespace-nowrap  text-[10px] md:text-xs text-foreground">{moment(job.job_posted).format('MM/DD/YY')}</td>
                            <td className="py-4  whitespace-wrap md:whitespace-nowrap  text-center  text-[10px] md:text-xs font-medium">
                              <div className="flex items-center justify-center gap-2">
                                <Link href={`/job/${job.job_id}`} className='text-xs font-semibold text-cyan-600 cursor-pointer  focus:outline-hidden  disabled:opacity-50 disabled:pointer-events-none'>
                                  <FaEye />
                                </Link>
                                <button
                                  type="button"
                                  onClick={() =>{handleUnsaveJob(job.job_id)}}
                                  className="text-xs font-semibold text-red-700 cursor-pointer  focus:outline-hidden  disabled:opacity-50 disabled:pointer-events-none"><FaRegTrashAlt />

                                </button>
                              </div>

                            </td>
                          </tr>
                        ))}

                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/*PANEL: SKILLS CHECKLISTS */}
              {skillsChecklistsVisible && (
                <div className="flex flex-col items-start justify-start gap-2 bg-white rounded-lg p-4 shadow-lg w-full">
                  <h3 className="text-gray-800 text-md font-black mb-2">
                    My Skills Checklists
                  </h3>
                </div>
              )}

              {/*PANEL: MY RESUME */}
              {myResumeVisible && (
                <div className="flex flex-col items-start justify-start gap-2 bg-white rounded-lg p-4 shadow-lg w-full">
                  <h3 className="text-gray-800 text-md font-black mb-2">
                    My Resume
                  </h3>
                </div>
              )}

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