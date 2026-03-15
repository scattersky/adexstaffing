import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import moment from "moment/moment";
import {SaveJobButton} from "@/components/SaveJobButton";
import Link from "next/link";
import {AiOutlineSend} from "react-icons/ai";
import {RiFolderAddLine, RiLock2Fill} from "react-icons/ri";
import {Slide, toast, ToastContainer} from "react-toastify";
import {BsInfoCircle} from "react-icons/bs";
import {ImInfo} from "react-icons/im";
import renderHTML from 'react-render-html';
import {useRouter} from "next/navigation";
import {FaCalendarAlt, FaHospitalAlt, FaRegCalendarAlt} from "react-icons/fa";
import {FaMoneyCheckDollar} from "react-icons/fa6";
import {MagicCard} from "@/components/magicui/magic-card";


export function JobCard({
                          job,
                          savedJobIds,
                          setSavedJobIds
                        }: {
    job: any;
    savedJobIds: string[];
    setSavedJobIds: React.Dispatch<React.SetStateAction<string[]>>;
  }) {
  const { user } = useAuth();

  const isSaved = savedJobIds.includes(String(job.job_id));
  const router = useRouter();

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

  const trimtext = (description:any, limit:any ) => {
    const limitedDescription =
      description.length > limit
        ? description.slice(0, limit) + '...'
        : description;

    return limitedDescription;
  };

  return (
      <li key={job.job_id} >
        <MagicCard
          gradientOpacity={0}
          gradientTo="#c90000"
          gradientFrom="#ff0000"
          className="border-[2px] rounded-lg shadow-lg border-transparent"
        >
        <div className="p-5 bg-white rounded-md shadow-sm">
          <div className="justify-between sm:flex">
            <div className="flex-1">
              <p className='text-red-800 uppercase font-bold  tracking-widest text-[11px]'>{job.job_degree}</p>
              <Link href={`/job/${job.job_id}`} className=' text-gray-800 hover:text-cyan-800'>
              <h3 className="text-[20px] font-medium">
                {job.job_title}
              </h3>
              </Link>
              <div className='h-37.5 relative overflow-hidden w-full'>
                <div className="text-gray-500 mt-2 pr-2 text-xs">



                  {/*{trimtext( job.job_description,350)}*/}
                  {renderHTML(job.job_description)}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white to-transparent h-16 w-full"></div>
              </div>

            </div>
            <div className="flex flex-col justify-start items-start mt-5 text-sm sm:mt-0 sm:space-y-2 max-w-50">
                <div className='flex items-center justify-start gap-2'>

                  <div className='min-w-4'>
                    <FaRegCalendarAlt size={16} color="gray" />
                  </div>
                  <span className="flex items-center text-gray-500">
                    {moment(job.job_posted).format('MMMM Do YYYY')}
                  </span>
                </div>
              <div className='flex items-center justify-start gap-2'>

                <div className='min-w-4'>
                  <FaMoneyCheckDollar size={16} color="gray" />
                </div>
                <span className="flex items-center text-gray-500">
                  ${job.job_weekly_pay}/wk
                 </span>
              </div>
              {/*<div className='flex items-start justify-start gap-2'>*/}
              {/*  <div className='min-w-4'>*/}
              {/*    <FaHospitalAlt size={16} color="gray"/>*/}
              {/*  </div>*/}
              {/*  <span className="flex items-center text-gray-500 wrap-break-word">*/}
              {/*     {job.job_facility}*/}
              {/*   </span>*/}
              {/*</div>*/}
            </div>
          </div>
          <div className="mt-4 items-center space-y-4 text-sm sm:flex sm:space-x-4 sm:space-y-0">
                                        <span className="flex items-center text-gray-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                                                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                                            </svg>
                                          {job.job_specialty}
                                        </span>
            <span className="flex items-center text-gray-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                            </svg>
              {job.job_city}, {job.job_state}
                                        </span>
            <div className='flex items-center justify-end gap-2 ml-auto'>
              <Link href={`/job/${job.job_id}`} className='flex items-center justify-center gap-1 text-center px-4 py-2 rounded-md transition cursor-pointer text-[13px] duration-700 text-white hover:bg-linear-to-br hover:from-cyan-500 hover:to-cyan-800 bg-linear-to-br from-cyan-600 to-cyan-800'>
                <ImInfo  color="white" size={16}/>
                <span className="flex items-center text-white text-xs leading-1">View Details</span>
              </Link>

              {user ?  (
                <button
                  onClick={handleSave}
                  disabled={isSaved}

                  className={`flex items-center justify-center gap-1 text-center px-4 py-2 border rounded-md transition cursor-pointer text-[13px] duration-700 text-white ${
                    isSaved
                      ? "bg-gray-500 cursor-not-allowed"
                      : "hover:bg-linear-to-br hover:from-sky-600 hover:to-cyan-900 bg-linear-to-br from-sky-700 to-cyan-900"
                  }`}
                >
                  <RiFolderAddLine color="white" size={16} />
                  <span className="flex items-center text-white text-xs leading-1">{isSaved ? "Job Saved" : "Save to My Jobs"}</span>
                </button>
              ) : (
                <button onClick={handleGoToLogin} className='flex items-center justify-center gap-1 text-center px-4 py-2 bg-gray-500 cursor-pointer duration-700 text-[13px] rounded-md transition '>
                  <RiLock2Fill color="white" size={16}  />
                  <span className="flex items-center text-white text-xs">Login To Save Job</span>
                </button>
              )}

              <Link href={'https://adextravelnursing.com/'} className='flex items-center justify-center gap-1 text-center px-4 py-2 rounded-md  hover:bg-linear-to-br hover:from-red-600 hover:to-red-900 bg-linear-to-br from-red-700 to-red-800 transition cursor-pointer text-[13px]'>
                <AiOutlineSend color="white" size={16}  />
                <span className="flex items-center text-white text-xs">Apply Now</span>
              </Link>
            </div>

          </div>
        </div>
        </MagicCard>
      </li>

  );
}