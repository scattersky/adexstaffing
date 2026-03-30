'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "primereact/skeleton";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@tremor/react';
import { MatchedJobCard } from "@/components/MatchedJobCard";
import { Badge } from 'primereact/badge';

export default function CandidateOpportunities() {
  const { user, loading: authLoading } = useAuth();
  const [candidate, setCandidate] = useState<any>(null);
  const [matchedJobs, setMatchedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [activeMatchesTabIndex, setActiveMatchesTabIndex] = useState(0);

  // Helper to normalize array data
  const safeArray = (val: any) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === "string") {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return parsed;
        return val.split(",").map((v) => v.trim());
      } catch {
        return val.split(",").map((v) => v.trim());
      }
    }
    return [String(val)];
  };

  const getMatchLabel = (score: number) => {
    if (score >= 9) return <Badge value="Perfect Match!" severity="success" className="text-xs" />;
    if (score >= 7) return <Badge value="Strong Match!" severity="secondary" />;
    if (score >= 4) return <Badge value="Possible Match!" severity="warning" />;
    return <Badge value="Weak Match!" severity="danger" />;
  };

  // Fetch logged-in candidate profile
  const fetchCandidate = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await axios.get("https://adextravelnursing.com/api_get_candidate.php", {
        params: { uid: user.uid }
      });
      const c = Array.isArray(res.data) && res.data.length > 0 ? res.data[0] : null;

      if (c) {
        c.specialty = safeArray(c.specialty);
        c.preferred_shift = safeArray(c.preferred_shift);
        c.preferred_location = safeArray(c.preferred_location);
        setCandidate(c);
        fetchMatchedJobs(c);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch matched jobs for this candidate
  const fetchMatchedJobs = async (candidate: any) => {
    setJobsLoading(true);
    try {
      const res = await axios.post("https://adextravelnursing.com/api_match_jobs.php", { candidate }, {
        headers: { "Content-Type": "application/json" }
      });
      setMatchedJobs(res.data);
    } catch (err) {
      console.error("Match API error:", err);
    } finally {
      setJobsLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidate();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh] w-full">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-red-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      <h2 className="text-2xl font-bold">Your Opportunities</h2>

      {jobsLoading ? (
        <div className="flex flex-col gap-4">
          <Skeleton width="100%" className="h-20" />
          <Skeleton width="100%" className="h-20" />
          <Skeleton width="100%" className="h-20" />
        </div>
      ) : matchedJobs.length === 0 ? (
        <p>No matching jobs found.</p>
      ) : (
        <TabGroup index={activeMatchesTabIndex} onIndexChange={setActiveMatchesTabIndex}>
          <TabList className="mb-4">
            <Tab className={activeMatchesTabIndex === 0 ? "bg-green-600 text-white px-3 py-1 rounded" : "px-3 py-1"}>Perfect Matches</Tab>
            <Tab className={activeMatchesTabIndex === 1 ? "bg-yellow-600 text-white px-3 py-1 rounded" : "px-3 py-1"}>Strong Matches</Tab>
            <Tab className={activeMatchesTabIndex === 2 ? "bg-orange-600 text-white px-3 py-1 rounded" : "px-3 py-1"}>Possible Matches</Tab>
            <Tab className={activeMatchesTabIndex === 3 ? "bg-red-600 text-white px-3 py-1 rounded" : "px-3 py-1"}>Weak Matches</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {matchedJobs.filter(job => job.matchScore >= 9).map(job => (
                <MatchedJobCard key={job.job_id} job={job} safeArray={safeArray} getMatchLabel={getMatchLabel} />
              ))}
            </TabPanel>
            <TabPanel>
              {matchedJobs.filter(job => job.matchScore >= 7 && job.matchScore < 9).map(job => (
                <MatchedJobCard key={job.job_id} job={job} safeArray={safeArray} getMatchLabel={getMatchLabel} />
              ))}
            </TabPanel>
            <TabPanel>
              {matchedJobs.filter(job => job.matchScore >= 4 && job.matchScore < 7).map(job => (
                <MatchedJobCard key={job.job_id} job={job} safeArray={safeArray} getMatchLabel={getMatchLabel} />
              ))}
            </TabPanel>
            <TabPanel>
              {matchedJobs.filter(job => job.matchScore < 4).map(job => (
                <MatchedJobCard key={job.job_id} job={job} safeArray={safeArray} getMatchLabel={getMatchLabel} />
              ))}
            </TabPanel>
          </TabPanels>
        </TabGroup>
      )}
    </div>
  );
}