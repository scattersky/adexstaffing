'use client'

import { useEffect, useState } from "react";
import {useParams, useRouter} from "next/navigation";
import axios from "axios";
import InnerPageTitle from "@/app/sections/InnerPageTitle";
import {FaClipboardList, FaRegTrashAlt} from "react-icons/fa";
import {PiListChecksBold} from "react-icons/pi";
import {IoSettingsSharp} from "react-icons/io5";
import {ImLifebuoy} from "react-icons/im";
import moment from "moment";
import {FaArrowUpRightFromSquare} from "react-icons/fa6";
import {AiOutlineSend} from "react-icons/ai";
import Link from "next/link";
import {RiFolderAddLine, RiLock2Fill} from "react-icons/ri";
import {useAuth} from "@/context/AuthContext";
import {ToastContainer, toast, Slide} from 'react-toastify';
import renderHTML from 'react-render-html';

export default function SingleJobPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const isSaved = savedJobIds.includes(String(job?.job_id));



  useEffect(() => {
    if (!id) return;
    axios
      .get("https://adextravelnursing.com/api_get_single_job.php", {
        params: { job_id: id }
      })
      .then((res) => {
        setJob(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!user) return;

    axios
      .get("https://adextravelnursing.com/api_get_saved_jobs.php", {
        params: { firebase_uid: user.uid }
      })
      .then((res) => {
        // Force all IDs to string
        const normalizedIds = res.data.map((job_id: any) => String(job_id));
        setSavedJobIds(normalizedIds);
      });
  }, [user?.uid]);

  const handleSave = async () => {
    if (!user) {
      alert("Please log in first.");
      return;
    }
    try {
      await axios.post(
        "https://adextravelnursing.com/api_save_job.php",
        {
          firebase_uid: user.uid,
          job_id: job.job_id
        }
      );
      toastJobSaved();
      setSavedJobIds((prev) => [...prev, String(job.job_id)]);
    } catch (err) {
      console.error(err);
      toastJobSavedError();
    }
  };

  const toastJobSaved = () => toast.info('Job Saved!', {
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
  const toastJobSavedError = () => toast.error('Error Saving Job', {
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

  const handleGoToLogin = () => {
    router.push('../login');
  }

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-red-700 rounded-full animate-spin"></div>
      </div>
    );
  }
  if (!job) return <p>Job not found.</p>;

  return (
    <div>
      <InnerPageTitle title='Job Details' />
      <div className="bg-gray-100 pt-2 pb-12">
        <section className="mt-12 max-w-7xl mx-auto md:px-8 min-h-screen">
          <div className="flex justify-between items-start gap-4 flex-wrap md:flex-nowrap px-4 md:px-0">
            {/*DASHBOARD LEFT*/}
            <div className="flex flex-col items-start justify-start gap-2 w-full md:w-[25%] h-screen" >
              <div className="flex flex-col items-start justify-start gap-1 bg-white rounded-lg p-4 shadow-lg w-full sticky top-4">
                <div className="flex justify-center items-center px-2 pt-1 pb-2 w-45 rounded-md bg-sky-800 -ml-0.5 mb-1">
                  <span className="text-white text-[11px] leading-3 mt-1  font-medium uppercase tracking-widest">ADDITIONAL DETAILS</span>
                </div>
                <div className='space-y-2 pb-2'>
                  <div className='flex items-center justify-start text-xs text-gray-600'>
                    <p className=' text-xs'><span className='font-bold  text-xs'>Location: </span>{job.job_city}, {job.job_state}</p>
                  </div>
                  <div className='flex items-center justify-start text-xs text-gray-600'>
                    <p className=' text-xs'><span className='font-bold  text-xs'>Degree: </span>{job.job_degree}</p>
                  </div>
                  <div className='flex items-center justify-start text-xs text-gray-600'>
                    <p className=' text-xs'><span className='font-bold  text-xs'>Specialty: </span>{job.job_specialty}</p>
                  </div>
                  <div className='flex items-center justify-start text-xs text-gray-600'>
                    <p className=' text-xs'><span className='font-bold  text-xs'>Shift: </span>{job.job_shift}</p>
                  </div>
                  <div className='flex items-center justify-start text-xs text-gray-600'>
                    <p className=' text-xs'><span className='font-bold  text-xs'>Weekly Pay: </span>${job.job_weekly_pay}</p>
                  </div>
                  <div className='flex items-center justify-start text-xs text-gray-600'>
                    <p className=' text-xs'><span className='font-bold  text-xs'>Duration: </span>{job.job_priority}</p>
                  </div>
                  <div className='flex items-center justify-start text-xs text-gray-600'>
                    <p className=' text-xs'><span className='font-bold  text-xs'>VMS ID: </span>{job.job_vms_id}</p>
                  </div>
                  <div className='flex items-center justify-start text-xs text-gray-600'>
                    <p className=' text-xs'><span className='font-bold  text-xs'>Job ID: </span>{job.job_id}</p>
                  </div>
                </div>
              </div>
            </div>

            {/*DASHBOARD CENTER*/}
            <div className="flex flex-col items-start justify-between gap-2 bg-white rounded-lg p-6 shadow-lg w-full md:w-[60%] h-full" >
              <div className=" w-full">
                <div className='flex items-center justify-start text-xs text-gray-600'>
                  <p className=' text-xs'><span className='font-bold  text-[12px]'>Posted: </span>{moment(job.job_posted).format('MMMM Do YYYY')}</p>
                </div>
                <h3 className="text-gray-700 text-xl font-black mb-2">
                  {job.job_title}
                </h3>
                <hr className='bg-black w-full h-0.5 mb-3 opacity-20'/>
                <div className="text-gray-600 text-sm mb-4">
                  {renderHTML(job.job_description)}
                </div>
              </div>
            </div>

            {/*DASHBOARD RIGHT*/}
            <div className="flex flex-col items-start justify-start gap-4 w-full md:w-[15%] h-screen" >
              <div className="flex flex-col items-start justify-start gap-2  w-full pt-1  sticky top-4">
                {user ?  (
                  <Link href={`/apply/${job.job_id}`}  className='flex items-center justify-center gap-1 w-full text-center px-4 py-2 rounded-md  hover:bg-linear-to-br hover:from-red-600 hover:to-red-900 bg-linear-to-br from-red-700 to-red-800 transition cursor-pointer text-[13px]'>
                    <AiOutlineSend color="white" size={16}  />
                    <span className="flex items-center text-white text-xs">Apply Now</span>
                  </Link>
                ) : (
                  <Link href="/login" className='flex items-center justify-center gap-1 w-full text-center px-4 py-2 rounded-md bg-[#995757] transition cursor-pointer text-[13px]'>
                    <RiLock2Fill color="white" size={16}  />
                    <span className="flex items-center text-white text-xs">Login To Apply</span>
                  </Link>
                )}
                  {user ?  (
                    <button
                      onClick={handleSave}
                      disabled={isSaved}

                      className={`flex items-center justify-center gap-1 w-full text-center px-4 py-2 border rounded-md transition cursor-pointer text-[13px] duration-700 text-white ${
                        isSaved
                          ? "bg-gray-500 cursor-not-allowed"
                          : "hover:bg-linear-to-br hover:from-sky-600 hover:to-cyan-900 bg-linear-to-br from-sky-700 to-cyan-900"
                      }`}
                    >
                      <RiFolderAddLine color="white" size={16} />
                      <span className="flex items-center text-white text-xs leading-1">{isSaved ? "Job Saved" : "Save to My Jobs"}</span>
                    </button>
                  ) : (
                    <button onClick={handleGoToLogin} className='flex items-center justify-center gap-1 w-full text-center px-4 py-2 bg-gray-500 cursor-pointer duration-700 text-[13px] rounded-md transition '>
                      <RiLock2Fill color="white" size={16}  />
                      <span className="flex items-center text-white text-xs">Login To Save Job</span>
                    </button>
                  )}
                <div>


                </div>
              </div>
            </div>
          </div>


        </section>
      </div>
      <ToastContainer/>
    </div>
  );
}