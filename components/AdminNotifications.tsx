'use client';

import { useEffect, useState } from "react";
import axios from "axios";

interface CandidateData {
  name: string;
  matches: number;
}

interface Notification {
  id: number;
  type: string;
  message: string;
  data: { match_count: number; candidates: CandidateData[] };
  created_at: string;
}

interface RecruiterGroup {
  recruiter_uid: string;
  recruiter_name: string;
  recruiter_email: string;
  notifications: Notification[];
  total_matches: number;
}

export default function AdminNotifications() {
  const [groups, setGroups] = useState<RecruiterGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllNotifications = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "https://adextravelnursing.com/api_get_all_notifications.php"
        );

        // Ensure we always get an array
        const data = Array.isArray(res.data) ? res.data : [];
        setGroups(data);
      } catch (err) {
        console.error("Error fetching all notifications:", err);
        setGroups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllNotifications();
  }, []);

  if (loading) return <p>Loading notifications...</p>;
  if (!groups.length) return <p>No notifications found.</p>;

  return (
    <div className="space-y-6 w-full">
      {groups.map((group) => (
        <div key={group.recruiter_uid} className="border p-4 rounded bg-white dark:bg-gray-800 shadow-sm w-full">
          <div className="mb-3">
            <h3 className="font-bold text-lg">{group.recruiter_name || "Unnamed Recruiter"}</h3>
            <p className="text-sm text-gray-500">{group.recruiter_email}</p>
            <p className="text-sm font-semibold">Total Perfect Matches: {group.total_matches}</p>
          </div>

          <div className="space-y-2">
            {group.notifications.map((n) => (
              <div key={n.id} className="p-2 border rounded bg-gray-50 dark:bg-gray-700">
                <div className="flex justify-between text-sm mb-1">
                  <span>{n.message}</span>
                  <span className="text-xs text-gray-400">{n.created_at ? new Date(n.created_at).toLocaleString() : ""}</span>
                </div>
                {n.data?.candidates?.length ? (
                  <ul className="ml-4 list-disc text-xs text-gray-700 dark:text-gray-300">
                    {n.data.candidates.map((c, idx) => (
                      <li key={idx}>
                        {c.name}: {c.matches} perfect match{c.matches !== 1 ? "es" : ""}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-500">No candidate details</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}