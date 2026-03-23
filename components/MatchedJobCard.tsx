import {JSX} from "react";
import {ImInfo} from "react-icons/im";
import Link from "next/link";

interface MatchedJobCardProps {
  job: any;
  safeArray: (val: any) => string[];
  getMatchLabel: (score: number) => JSX.Element;
}

export function MatchedJobCard({ job, safeArray, getMatchLabel }: MatchedJobCardProps) {
  return (
    <div className="px-4 py-2 border rounded-md mb-2 bg-white shadow w-full border-l-4 border-[#004A71]">

      <div className="flex justify-between items-end">

        <div className='flex flex-col space-y-1'>
          <div className='max-w-32 ml-[-2px]'>
            {getMatchLabel(job.matchScore)}
          </div>
          <span className='text-[10px] text-gray-600'><strong>ID: </strong>{job.job_id}</span>
          <strong>{job.job_title}</strong>
          <div className="text-sm mb-1">
            <span>{safeArray(job.job_specialty).join(", ")} | {safeArray(job.job_shift).join(", ")} | {job.job_city ? job.job_city + ", " : ""} {safeArray(job.job_state).join(", ")}</span>
          </div>
        </div>

        <Link href={`/job/${job.job_id}`} className='flex items-center justify-center mt-1 gap-1 text-center px-4 py-2 rounded-md transition cursor-pointer text-[13px] duration-700 text-white  bg-linear-to-br from-sky-900 to-sky-800'>
          <ImInfo  color="white" size={16}/>
          <span className="flex items-center text-white text-xs leading-1">View Job Details</span>
        </Link>

      </div>


    </div>
  );
}