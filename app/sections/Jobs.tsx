"use client"
import {useEffect, useState, useRef} from "react";
import axios from "axios";
import moment from 'moment';
import Link from "next/link";
import { RiFolderAddLine } from "react-icons/ri";
import { AiOutlineSend } from "react-icons/ai";
import { useAuth } from "@/context/AuthContext";
import {SaveJobButton} from "@/components/SaveJobButton";
import {JobCard} from "@/components/JobCard";
import {ToastContainer, toast, Slide} from 'react-toastify';

;


export default function Jobs() {
  const { user } = useAuth();
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);


  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const jobsPerPage = 20;
  const [degreeInput, setDegreeInput] = useState("");
  const [specialtyInput, setSpecialtyInput] = useState("");
  const [stateInput, setStateInput] = useState("");

  const [degree, setDegree] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [filterOptions, setFilterOptions] = useState<{
    degrees: string[];
    specialties: string[];
    states: string[];
  }>({
    degrees: [],
    specialties: [],
    states: [],
  });
  useEffect(() => {
    axios
      .get("https://adextravelnursing.com/api_get_jobs.php", {
        params: {
          page: currentPage,
          limit: jobsPerPage,
          degree,
          specialty,
          state: stateFilter,
        },
      })
      .then((response) => {
        setJobs(response.data.jobs);
        setTotalPages(response.data.totalPages);

        if (response.data.filters) {
          setFilterOptions(response.data.filters);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage, degree, specialty, stateFilter]);
  const applyFilters = () => {
    setCurrentPage(1);
    setDegree(degreeInput);
    setSpecialty(specialtyInput);
    setStateFilter(stateInput);
  };

  const jobsContainerRef = useRef<HTMLDivElement>(null);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    // Scroll jobs container into view
    jobsContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-red-700 rounded-full animate-spin"></div>
      </div>
    );
  }
  return (
    <div className="bg-gray-100 pt-2 pb-12">
      <section className="mt-12 max-w-5xl mx-auto px-4">
        <div>
          <h2 className="text-gray-800 text-3xl font-semibold">
            Explore  Jobs
          </h2>
        </div>
        {/*FILTERS*/}
        <div className="mt-6 grid md:grid-cols-4 gap-4">

          {/* Degree */}
          <select
            value={degreeInput}
            onChange={(e) => setDegreeInput(e.target.value)}
            className="p-2 border rounded bg-white"
          >
            <option value="">All Degrees</option>
            {filterOptions?.degrees?.map((deg: string) => (
              <option key={deg} value={deg}>
                {deg}
              </option>
            ))}
          </select>

          {/* Specialty */}
          <select
            value={specialtyInput}
            onChange={(e) => setSpecialtyInput(e.target.value)}
            className="p-2 border rounded bg-white"
          >
            <option value="">All Specialties</option>
            {filterOptions.specialties.map((spec: string) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>

          {/* State */}
          <select
            value={stateInput}
            onChange={(e) => setStateInput(e.target.value)}
            className="p-2 border rounded bg-white"
          >
            <option value="">All States</option>
            {filterOptions.states.map((state: string) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>

          {/* Apply Button */}
          <button
            onClick={applyFilters}
            className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-600 transition cursor-pointer text-[13px]"
          >
            Apply Filters
          </button>

        </div>
        {loading && (
          <div className="flex items-center justify-center min-h-screen">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-red-800 rounded-full animate-spin"></div>
          </div>
        )}

        {!loading && jobs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h2 className="text-2xl font-semibold mb-2">
              No Jobs Found
            </h2>
            <p className="text-gray-600">
              Try adjusting your filters or clearing them to see more results.
            </p>
          </div>
        )}

        {!loading && jobs.length > 0 && (
          <>

            {/*JOB LIST*/}
            <div ref={jobsContainerRef}>
              <ul className="mt-6 space-y-4">
              {
                jobs.map((job: any) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    savedJobIds={savedJobIds}
                    setSavedJobIds={setSavedJobIds}
                  />
                ))
              }
            </ul>
            </div>
            {/*PAGINATION*/}
            <div className="mt-8 flex justify-center items-center gap-2">

              {/* Prev Button */}
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
              >
                Prev
              </button>

              {/* Page Numbers */}
              {(() => {
                const maxVisible = 5;
                const half = Math.floor(maxVisible / 2);

                let start = Math.max(1, currentPage - half);
                let end = start + maxVisible - 1;

                if (end > totalPages) {
                  end = totalPages;
                  start = Math.max(1, end - maxVisible + 1);
                }

                const pages = [];
                for (let i = start; i <= end; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => handlePageChange(i)}
                      className={`px-3 py-1 rounded ${
                        currentPage === i
                          ? "bg-red-700 text-white"
                          : "bg-gray-100"
                      }`}
                    >
                      {i}
                    </button>
                  );
                }

                return pages;
              })()}

              {/* Next Button */}
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
              >
                Next
              </button>

            </div>
            <p className="text-center text-sm text-gray-500 mt-4">
              Page {currentPage} of {totalPages}
            </p>
          </>
        )}


      </section>
      <ToastContainer/>
    </div>

  )
}