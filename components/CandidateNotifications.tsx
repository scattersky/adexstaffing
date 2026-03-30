'use client';
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface CandidateMatch {
  name: string;
  matches: number;
  job_ids: string[];
}

interface NotificationData {
  match_count: number;
  candidates?: CandidateMatch[];
  candidate?: CandidateMatch; // fallback if backend sends a single candidate
}

interface Notification {
  id: number;
  message: string;
  data: NotificationData;
  created_at: string;
}

interface Props {
  candidateUid: string;
}

export default function CandidateNotifications({ candidateUid }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});
  const [jobsByNotification, setJobsByNotification] = useState<{ [key: number]: any[] }>({});
  const [jobsLoading, setJobsLoading] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    if (!candidateUid) return;

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `https://adextravelnursing.com/api_get_candidate_notifications.php?uid=${candidateUid}`
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
  }, [candidateUid]);

  // Normalize candidate data (handles `candidate` or `candidates`)
  const getCandidatesArray = (data: NotificationData): CandidateMatch[] => {
    if (Array.isArray(data.candidates)) return data.candidates;
    if (data.candidate) return [data.candidate];
    return [];
  };

  // Ensure job_ids are strings
  const normalizeJobIds = (ids: any): string[] => {
    if (!ids) return [];
    if (Array.isArray(ids)) return ids.map(String);
    if (typeof ids === "string") return ids.split(",").map(s => s.trim());
    return [String(ids)];
  };

  const toggleDetails = async (n: Notification) => {
    const isOpen = expanded[n.id];

    setExpanded(prev => ({ ...prev, [n.id]: !isOpen }));

    if (!isOpen && !jobsByNotification[n.id]) {
      try {
        setJobsLoading(prev => ({ ...prev, [n.id]: true }));

        const candidatesData = getCandidatesArray(n.data);
        const allJobIds = candidatesData.flatMap(c => normalizeJobIds(c.job_ids));

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

  if (loading) return <p>Loading notifications...</p>;
  if (!notifications.length) return <p>No new notifications.</p>;

  return (
    <div className="space-y-4 w-full">
      {notifications.map((n) => {
        const candidatesData = getCandidatesArray(n.data);

        return (
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
                  candidatesData.map((c) => {
                    const jobs = jobsByNotification[n.id]?.filter((job: any) =>
                      normalizeJobIds(c.job_ids).includes(String(job.job_id))
                    );

                    return (
                      <div key={c.name} className="border rounded p-3 bg-gray-50 ">
                        <p className="font-semibold mb-2">
                          {c.name} — <span className='text-sm font-normal'>{c.matches} match{c.matches !== 1 ? "es" : ""}</span>
                        </p>

                        {jobs && jobs.length > 0 ? (
                          jobs.map((job: any) => (
                            <div key={job.job_id} className="mb-2 bg-gray-100">
                              <div className="p-3 border rounded flex justify-between items-start">
                                <div className='flex flex-col space-y-1'>
                                  <span className='text-[10px] text-gray-600'><strong>ID: </strong>{job.job_id}</span>
                                  <strong className='text-sm'>{job.job_title}</strong>
                                  <div className="text-sm mb-1">
                                    <span>{Array.isArray(job.job_specialty) ? job.job_specialty.join(", ") : job.job_specialty} | {Array.isArray(job.job_shift) ? job.job_shift.join(", ") : job.job_shift} | {job.job_city ? job.job_city + ", " : ""} {Array.isArray(job.job_state) ? job.job_state.join(", ") : job.job_state}</span>
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
        );
      })}
    </div>
  );
}