'use client';
import { useEffect, useState } from "react";
import axios from "axios";
import {ImInfo} from "react-icons/im";
import Link from "next/link";

interface CandidateMatch {
  id: number;
  name: string;
  matches: number;
  job_ids: string[];
}

interface NotificationData {
  match_count: number;
  candidates: CandidateMatch[];
}

interface Notification {
  id: number;
  message: string;
  data: NotificationData;
  created_at: string;
}

interface Props {
  recruiterUid: string;
}

export default function RecruiterNotifications({ recruiterUid }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});
  const [jobsByNotification, setJobsByNotification] = useState<{ [key: number]: any[] }>({});
  const [jobsLoading, setJobsLoading] = useState<{ [key: number]: boolean }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!recruiterUid) return;

    const fetchNotifications = async () => {
      setCurrentPage(1);
      try {
        const res = await axios.get(
          `https://adextravelnursing.com/api_get_recruiter_notifications.php?uid=${recruiterUid}`
        );
        setNotifications(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [recruiterUid]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // 🔥 Toggle + fetch jobs ONLY once
  const toggleDetails = async (n: Notification) => {
    const isOpen = expanded[n.id];

    setExpanded(prev => ({
      ...prev,
      [n.id]: !isOpen
    }));

    if (!isOpen && !jobsByNotification[n.id]) {
      try {
        setJobsLoading(prev => ({ ...prev, [n.id]: true }));

        const allJobIds = n.data.candidates.flatMap(c => c.job_ids);
console.log(allJobIds);
        const res = await axios.post(
          "https://adextravelnursing.com/api_get_jobs_by_ids.php",
          { job_ids: allJobIds },
          { headers: { "Content-Type": "application/json" } }
        );

        setJobsByNotification(prev => ({
          ...prev,
          [n.id]: Array.isArray(res.data) ? res.data : []
        }));
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setJobsLoading(prev => ({ ...prev, [n.id]: false }));
      }
    }
  };

  const safeArray = (val: any) => {
    if (!val) return [];

    // Already an array
    if (Array.isArray(val)) return val;

    // JSON string?
    if (typeof val === "string") {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return parsed;
        return [val]; // fallback single string
      } catch {
        // fallback for comma-separated string
        return val.split(",").map((v) => v.trim());
      }
    }

    // fallback for other types
    return [String(val)];
  };

  if (loading) return <p>Loading notifications...</p>;
  if (!notifications.length) return <p>No new notifications.</p>;

  const totalPages = Math.ceil(notifications.length / itemsPerPage);

  const paginatedNotifications = notifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4 w-full">
      {paginatedNotifications.map((n) => (
        <div
          key={n.id}
          className="border py-4 px-6 rounded shadow-sm bg-white dark:bg-gray-800 w-full border-l-4 border-[#004A71]"
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold">{n.message}</p>
              <p className="text-xs text-gray-500">
                {new Date(n.created_at).toLocaleString()}
              </p>
            </div>

            <button
              onClick={() => toggleDetails(n)}
              className="text-sm px-3 py-1 bg-linear-to-br from-sky-900 to-sky-800 text-white rounded-md"
            >
              {expanded[n.id] ? "Hide" : "Details"}
            </button>
          </div>

          {/* Expanded */}
          {expanded[n.id] && (
            <div className="mt-4 space-y-4">
              {jobsLoading[n.id] ? (
                <p className="text-sm text-gray-500">Loading jobs...</p>
              ) : (
                n.data.candidates.map((c) => {
                  const jobs = jobsByNotification[n.id]?.filter((job: any) =>
                    c.job_ids.includes(job.job_id)
                  );

                  return (
                    <div key={c.name} className="border rounded p-3 bg-gray-50 ">
                      <p className="font-semibold mb-2">
                        {c.name} — <span className='text-sm font-normal'>{c.matches} match{c.matches !== 1 ? "es" : ""}</span>
                      </p>

                      {jobs && jobs.length > 0 ? (
                        jobs.map((job: any) => (
                          <div key={job.job_id} className="mb-2 bg-gray-100">

                            {/* 🔥 REPLACE THIS WITH YOUR EXISTING COMPONENT */}
                            <div className="p-3 border rounded flex justify-between items-start">

                              <div className='flex flex-col space-y-1'>
                                <span className='text-[10px] text-gray-600'><strong>ID: </strong>{job.job_id}</span>
                                <strong className='text-sm'>{job.job_title}</strong>
                                <div className="text-sm mb-1">
                                  <span>{safeArray(job.job_specialty).join(", ")} | {safeArray(job.job_shift).join(", ")} | {job.job_city ? job.job_city + ", " : ""} {safeArray(job.job_state).join(", ")}</span>
                                </div>
                              </div>

                              <Link href={`/job/${job.job_id}`} className='flex items-center justify-center mt-1 gap-1 text-center px-3 py-3 rounded-md transition cursor-pointer text-[13px] duration-700 text-white  bg-linear-to-br from-sky-900 to-sky-800'>

                                <span className="flex items-center text-white text-xs leading-1">View Job</span>
                              </Link>

                            </div>

                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-gray-500">No jobs found</p>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      ))}
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 disabled:opacity-50 bg-gray-300 rounded-md text-gray-700 cursor-pointer"
        >
          Prev
        </button>

        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 disabled:opacity-50 bg-red-700 rounded-md text-white cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}