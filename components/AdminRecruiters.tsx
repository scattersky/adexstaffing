'use client';

import { useEffect, useState } from "react";
import axios from "axios";

interface Recruiter {
  recruiter_uid: string;
  first_name: string;
  last_name: string;
  email: string;
  total_perfect_matches: number;
}

export default function AdminRecruiters() {
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecruiters = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "https://adextravelnursing.com/api_get_recruiters_with_total_matches.php"
        );
        setRecruiters(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching recruiters:", err);
        setRecruiters([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecruiters();
  }, []);

  if (loading) return <p>Loading recruiters...</p>;
  if (!recruiters.length) return <p>No recruiters found.</p>;

  return (
    <div className="space-y-4">
      {recruiters.map((r) => (
        <div key={r.recruiter_uid} className="border p-4 rounded bg-white dark:bg-gray-800 shadow-sm flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg">{r.first_name} {r.last_name}</h3>
            <p className="text-sm text-gray-500">{r.email}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-sm">Total Perfect Matches: {r.total_perfect_matches}</p>
            {/* Replace with a Link to recruiter details page */}
            <a href={`/admin/recruiter/${r.recruiter_uid}`} className="text-xs text-blue-600 hover:underline mt-1 inline-block">View Details</a>
          </div>
        </div>
      ))}
    </div>
  );
}