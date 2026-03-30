"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import JobCard from "@/components/JobCard";
import {MagicCard} from "@/components/magicui/magic-card";
import Link from "next/link";
import renderHTML from "react-render-html";
import {FaRegCalendarAlt} from "react-icons/fa";
import moment from "moment";
import {FaMoneyCheckDollar} from "react-icons/fa6";
import {ImInfo} from "react-icons/im";
import {RiFolderAddLine, RiLock2Fill} from "react-icons/ri";
import {AiOutlineSend} from "react-icons/ai";

export default function CandidateApplications() {
  const { user, loading: authLoading } = useAuth();

  const [applications, setApplications] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchApplications = async () => {
      try {
        // 🔥 STEP 1: get job_ids
        const res = await axios.get(
          "https://adextravelnursing.com/api_get_candidate_application_ids.php",
          { params: { uid: user.uid } }
        );

        const apps = Array.isArray(res.data) ? res.data : [];
        setApplications(apps);

        const jobIds = apps.map((a) => a.job_id);

        if (!jobIds.length) {
          setJobs([]);
          return;
        }

        // 🔥 STEP 2: fetch jobs using your existing API
        const jobsRes = await axios.post(
          "https://adextravelnursing.com/api_get_jobs_by_ids.php",
          { job_ids: jobIds },
          { headers: { "Content-Type": "application/json" } }
        );

        setJobs(Array.isArray(jobsRes.data) ? jobsRes.data : []);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setApplications([]);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px] w-full">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-red-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!applications.length) {
    return (
      <div className="bg-white p-6 rounded shadow text-center">
        <p className="text-gray-600">You haven’t applied to any jobs yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((app) => {
        const job = jobs.find(j => j.job_id === app.job_id);

        if (!job) return null;

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
                    <a href={`/job/${job.job_id}`} className='text-red-700 text-sm'>...Read More</a>

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
                    <div className="text-xs text-gray-500 mt-1 ml-2">
                      Applied on {new Date(app.created_at).toLocaleDateString()}
                    </div>
                    <Link href={`/job/${job.job_id}`} className='flex items-center justify-center gap-1 text-center px-4 py-2 rounded-md transition cursor-pointer text-[13px] duration-700 text-white hover:bg-linear-to-br hover:from-cyan-500 hover:to-cyan-800 bg-linear-to-br from-cyan-600 to-cyan-800'>
                      <ImInfo  color="white" size={16}/>
                      <span className="flex items-center text-white text-xs leading-1">View Details</span>
                    </Link>




                  </div>


                </div>
              </div>
            </MagicCard>
          </li>

        );
      })}
    </div>
  );
}