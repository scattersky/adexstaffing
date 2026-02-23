"use client"
import {useEffect, useState, useRef} from "react";
import axios from "axios";
import moment from 'moment';
import Link from "next/link";
import { RiFolderAddLine } from "react-icons/ri";
import { AiOutlineSend } from "react-icons/ai";


export default function Jobs() {
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
  const trimtext = (description:any, limit:any ) => {
    // Use slice() to get the first 'limit' characters.
    // Add an ellipsis if the original string was longer than the limit.
    const limitedDescription =
      description.length > limit
        ? description.slice(0, limit) + '...'
        : description;

    return limitedDescription;
  };
  const jobsContainerRef = useRef<HTMLDivElement>(null);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    // Scroll jobs container into view
    jobsContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-red-700 rounded-full animate-spin"></div>
      </div>
    );
  }
  return (
    <div className="bg-gray-100 pt-2 pb-12">
      <section className="mt-12 max-w-5xl mx-auto md:px-8">
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
                  <li key={job.id} className="p-5 bg-white rounded-md shadow-sm">
                    <div>
                      <div className="justify-between sm:flex">
                        <div className="flex-1">
                          <p className='text-red-800 uppercase font-bold  tracking-widest text-[11px]'>{job.job_degree}</p>
                          <h3 className="text-[20px] font-medium text-gray-800">
                            {job.job_title}
                          </h3>
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
                          <button className='flex items-center justify-center gap-1 text-center px-4 py-2 border border-sky-800 hover:border-sky-700  rounded-md hover:bg-sky-700 bg-sky-800 transition cursor-pointer text-[13px] duration-700'>
                            <RiFolderAddLine color="white" size={16} />
                            <span className="flex items-center text-white text-xs">Save To My Jobs</span>
                          </button>
                          <Link href={'https://adextravelnursing.com/'} className='flex items-center justify-center gap-1 text-center px-4 py-2 border border-red-700 hover:border-red-600  bg-red-700 rounded-md hover:bg-red-600 duration-700 transition cursor-pointer text-[13px]'>
                            <AiOutlineSend color="white" size={16}  />
                            <span className="flex items-center text-white text-xs">Apply Now</span>
                          </Link>
                        </div>

                      </div>
                    </div>
                  </li>
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
    </div>

  )
}