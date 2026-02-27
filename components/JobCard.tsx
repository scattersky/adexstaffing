import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import moment from "moment/moment";
import {SaveJobButton} from "@/components/SaveJobButton";
import Link from "next/link";
import {AiOutlineSend} from "react-icons/ai";
import {RiFolderAddLine} from "react-icons/ri";
import {Slide, toast, ToastContainer} from "react-toastify";
import {BsInfoCircle} from "react-icons/bs";
import {ImInfo} from "react-icons/im";


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

  const trimtext = (description:any, limit:any ) => {
    const limitedDescription =
      description.length > limit
        ? description.slice(0, limit) + '...'
        : description;

    return limitedDescription;
  };

  return (
      <li key={job.job_id} className="p-5 bg-white rounded-md shadow-sm">
        <div>
          <div className="justify-between sm:flex">
            <div className="flex-1">
              <p className='text-red-800 uppercase font-bold  tracking-widest text-[11px]'>{job.job_degree}</p>
              <Link href={`/job/${job.job_id}`} className=' text-gray-800 hover:text-cyan-800'>
              <h3 className="text-[20px] font-medium">
                {job.job_title}
              </h3>
              </Link>
              <p className="text-gray-500 mt-2 pr-2 text-xs">
                {trimtext( job.job_description,350)}

              </p>
            </div>
            <div className="mt-5 space-y-4 text-sm sm:mt-0 sm:space-y-2">
                                            <span className="flex items-center text-gray-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                </svg>
                                              {moment(job.job_posted).format('MMMM Do YYYY')}

                                            </span>
              <span className="flex items-center text-gray-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                                </svg>
                        ${job.job_weekly_pay}/wk
                                            </span>
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
              {job.job_city}
                                        </span>
            <div className='flex items-center justify-end gap-2 ml-auto'>
              <Link href={`/job/${job.job_id}`} className='flex items-center justify-center gap-1 text-center px-4 py-2 border rounded-md transition cursor-pointer text-[13px] duration-700 text-white border-cyan-800 hover:border-cyan-600 hover:bg-cyan-600 bg-cyan-800'>
                <ImInfo  color="white" size={15}/>
                <span className="flex items-center text-white text-xs leading-1">View Details</span>
              </Link>
              <button
                onClick={handleSave}
                disabled={isSaved}

              className={`flex items-center justify-center gap-1 text-center px-4 py-2 border rounded-md transition cursor-pointer text-[13px] duration-700 text-white ${
                  isSaved
                    ? "bg-gray-500 cursor-not-allowed"
                    : " border-sky-800 hover:border-sky-700 hover:bg-sky-700 bg-sky-800"
                }`}
              >
                <RiFolderAddLine color="white" size={16} />
                <span className="flex items-center text-white text-xs leading-1">{isSaved ? "Job Saved" : "Save to My Jobs"}</span>
              </button>
              <Link href={'https://adextravelnursing.com/'} className='flex items-center justify-center gap-1 text-center px-4 py-2 border border-red-700 hover:border-red-600  bg-red-700 rounded-md hover:bg-red-600 duration-700 transition cursor-pointer text-[13px]'>
                <AiOutlineSend color="white" size={16}  />
                <span className="flex items-center text-white text-xs">Apply Now</span>
              </Link>
            </div>

          </div>
        </div>

      </li>

  );
}