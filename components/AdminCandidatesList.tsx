'use client';

import {
  Button,
  Tab,
  TabGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  TabList,
  TabPanel,
  TabPanels,
} from '@tremor/react';
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import {MagicCard} from "@/components/magicui/magic-card";
import Link from "next/link";
import {ImInfo} from "react-icons/im";
import {DotLoader} from "react-spinners";
import {Skeleton} from "primereact/skeleton";
import {Slide, toast, ToastContainer} from "react-toastify";
import {MultiSelect} from "primereact/multiselect";
import {FaUserCheck} from "react-icons/fa";
import { Badge } from 'primereact/badge';
import {MatchedJobCard} from "@/components/MatchedJobCard";

interface UserProfile {
  id: number;
  firebase_uid: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  specialty: string;
  years_experience: string;
}
interface AddCandidateForm {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  preferred_location: string[];
  preferred_shift: string[];
  degree: string;
  specialty: string[];
  misc_notes: string;
  recruiter_name: string;
  recruiter_email: string;
  role: string;
  firebase_uid: string | undefined;
}

export default function AdminCandidatesList() {
  const { user, role, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [matchedJobs, setMatchedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [activeMatchesTabIndex, setActiveMatchesTabIndex] = useState(0);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [candidatesLoading, setCandidatesLoading] = useState(false);
  const [addCandidateFormLoading, setAddCandidateFormLoading] = useState(false);
  const [specialtyOptions, setSpecialtyOptions] = useState<any[]>([]);
  const [status, setStatus] = useState<any>('');

  useEffect(() => {
    if (!user) return;

    axios
      .get("https://adextravelnursing.com/api_get_user.php", {
        params: { uid: user.uid }
      })
      .then((response) => {
        setUserData(response.data);

      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);

  // Fetch candidates
  const fetchCandidates = async () => {
    if (!user) return;
    setCandidatesLoading(true);
    try {
      const res = await axios.get(
        "https://adextravelnursing.com/api_admin_get_candidates.php",
        { params: { uid: user.uid } }
      );

      setCandidates(
        Array.isArray(res.data)
          ? res.data.map((c: any) => ({
            ...c,
            specialty: c.specialty ? c.specialty.split(',').map((s: string) => s.trim()) : [],
            preferred_shift: c.preferred_shift ? c.preferred_shift.split(',').map((s: string) => s.trim()) : [],
            preferred_location: c.preferred_location ? c.preferred_location.split(',').map((s: string) => s.trim()) : [],
          }))
          : []
      );
      setCandidatesLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMatchedJobs = async (candidate: any) => {
    setJobsLoading(true);

    try {
      const res = await axios.post(
        "https://adextravelnursing.com/api_match_jobs.php",
        { candidate },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setMatchedJobs(res.data);
    } catch (err) {
      console.error("Match API error:", err);
    } finally {
      setJobsLoading(false);
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

  const handleGetCandidateDetails = (candidate: any) => {
    setSelectedCandidate(candidate);
    fetchMatchedJobs(candidate);
    setActiveTabIndex(1); // switch to details tab
  };

  const getMatchLabel = (score: number) => {
    if (score >= 9) return (
      <Badge value="Perfect Match!" severity="success"></Badge>
    );
    if (score >= 7) return  (
      <Badge value="Strong Match!" severity="secondary"></Badge>
    );
    if (score >= 4) return (
      <Badge value="Possible Match!" severity="warning"></Badge>
    );
    return (
      <Badge value="Weak Match!" severity="danger"></Badge>
    );
  };
  useEffect(() => {
    fetchCandidates();
  }, [user]);

  const fetchSpecialties = async () => {
    try {
      const res = await axios.get(
        "https://adextravelnursing.com/api_get_specialty_options.php"
      );

      const options = res.data.map((specialty: string) => ({
        label: specialty,
        value: specialty
      }));

      setSpecialtyOptions(options);
    } catch (err) {
      console.error("Error fetching specialties:", err);
    }
  };
  useEffect(() => {
    fetchSpecialties();
  }, []);


  const shiftOptions = [
    { label: "Day", value: "Day" },
    { label: "Night", value: "Night" },
    { label: "Weekends", value: "Weekends" },
  ];
  const stateOptions = [
    { label: "Alabama", value: "AL" },
    { label: "Alaska", value: "AK" },
    { label: "Arizona", value: "AZ" },
    { label: "Arkansas", value: "AR" },
    { label: "California", value: "CA" },
    { label: "Colorado", value: "CO" },
    { label: "Connecticut", value: "CT" },
    { label: "Delaware", value: "DE" },
    { label: "Florida", value: "FL" },
    { label: "Georgia", value: "GA" },
    { label: "Hawaii", value: "HI" },
    { label: "Idaho", value: "ID" },
    { label: "Illinois", value: "IL" },
    { label: "Indiana", value: "IN" },
    { label: "Iowa", value: "IA" },
    { label: "Kansas", value: "KS" },
    { label: "Kentucky", value: "KY" },
    { label: "Louisiana", value: "LA" },
    { label: "Maine", value: "ME" },
    { label: "Maryland", value: "MD" },
    { label: "Massachusetts", value: "MA" },
    { label: "Michigan", value: "MI" },
    { label: "Minnesota", value: "MN" },
    { label: "Mississippi", value: "MS" },
    { label: "Missouri", value: "MO" },
    { label: "Montana", value: "MT" },
    { label: "Nebraska", value: "NE" },
    { label: "Nevada", value: "NV" },
    { label: "New Hampshire", value: "NH" },
    { label: "New Jersey", value: "NJ" },
    { label: "New Mexico", value: "NM" },
    { label: "New York", value: "NY" },
    { label: "North Carolina", value: "NC" },
    { label: "North Dakota", value: "ND" },
    { label: "Ohio", value: "OH" },
    { label: "Oklahoma", value: "OK" },
    { label: "Oregon", value: "OR" },
    { label: "Pennsylvania", value: "PA" },
    { label: "Rhode Island", value: "RI" },
    { label: "South Carolina", value: "SC" },
    { label: "South Dakota", value: "SD" },
    { label: "Tennessee", value: "TN" },
    { label: "Texas", value: "TX" },
    { label: "Utah", value: "UT" },
    { label: "Vermont", value: "VT" },
    { label: "Virginia", value: "VA" },
    { label: "Washington", value: "WA" },
    { label: "West Virginia", value: "WV" },
    { label: "Wisconsin", value: "WI" },
    { label: "Wyoming", value: "WY" }
  ];
  // Add New Candidate
  const [addCandidateForm, setAddCandidateForm] = useState<AddCandidateForm>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    preferred_location: [],
    preferred_shift: [],
    degree: '',
    specialty: [],
    misc_notes: '',
    recruiter_name: '',
    recruiter_email: '',
    role: 'candidate',
    firebase_uid: user?.uid,
  });
  const handleAddCandidateFormChange = (e: any) => {
    setAddCandidateForm({
      ...addCandidateForm,
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
    if (user?.uid) {
      setAddCandidateForm(prev => ({
        ...prev,
        firebase_uid: user.uid
      }));
    }
  }, [user]);
  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(e.target.selectedOptions, option => option.value);

    setAddCandidateForm(prev => ({
      ...prev,
      [e.target.name]: values
    }));
  };
  const handleUpdateAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddCandidateFormLoading(true);

    try {
      // Prepare the payload
      const payload = {
        ...addCandidateForm,
        firebase_uid: user?.uid, // ensure UID is always included
        specialty: addCandidateForm.specialty, // array
        preferred_location: addCandidateForm.preferred_location, // array
        preferred_shift: addCandidateForm.preferred_shift, // array
      };

      const res = await axios.post(
        'https://adextravelnursing.com/api_add_new_candidate.php',
        payload,
        {
          headers: {
            'Content-Type': 'application/json', // ensure server reads JSON
          },
        }
      );

      if (res.data.status === 'success') {
        toast.success(res.data.message,{
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

        // Reset the form
        setAddCandidateForm({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          preferred_location: [],
          preferred_shift: [],
          degree: '',
          specialty: [],
          misc_notes: '',
          recruiter_name: '',
          recruiter_email: '',
          role: 'candidate',
          firebase_uid: user?.uid,
        });

        fetchCandidates(); // refresh candidate list
      } else if (res.data.status === 'exists') {
        toast.warning('Candidate already exists!',{
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
      } else {
        toast.error(res.data.message,{
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
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err, {
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
    } finally {
      setAddCandidateFormLoading(false);
    }
  };

  return (
    <>
      <TabGroup index={activeTabIndex} onIndexChange={setActiveTabIndex} className="mt-2">
        <TabList>
          <Tab className={`px-4 py-2 cursor-pointer rounded-md ${activeTabIndex === 0 ? 'bg-sky-900 text-white' : ''}`}>Candidates</Tab>
          <Tab className={`px-4 py-2 cursor-pointer rounded-md ${activeTabIndex === 1 ? 'bg-sky-900  text-white' : ''}`} disabled={!selectedCandidate}>Details</Tab>
          <Tab className={`px-4 py-2 cursor-pointer rounded-md ${activeTabIndex === 2 ? 'bg-sky-900  text-white' : ''}`}>Add New</Tab>
        </TabList>

        <TabPanels>
          {/* Candidates List */}
          <TabPanel>
            {candidatesLoading ? (
              <div className="flex justify-center items-center text-center h-64 w-full">
                <div className="flex flex-col flex-nowrap justify-center items-center text-center h-full w-full">
                  <Skeleton width="100%" className="mb-4 min-h-10 min-w-full" />
                  <Skeleton width="100%" className="mb-4 min-h-10 min-w-full" />
                  <Skeleton width="100%" className="mb-4 min-h-10 min-w-full" />
                </div>
              </div>
            ) : (
              <Table className="mt-10">
                <TableHead>
                  <TableRow className="border-b border-tremor-border dark:border-dark-tremor-border">
                    <TableHeaderCell className='font-bold text-sm uppercase tracking-wide'>Name</TableHeaderCell>
                    <TableHeaderCell className='font-bold text-sm uppercase tracking-wide'>Degree/Modality</TableHeaderCell>
                    <TableHeaderCell className='font-bold text-sm uppercase tracking-wide'>Specialty/Specialties</TableHeaderCell>
                    <TableHeaderCell className='font-bold text-sm uppercase tracking-wide'>Preferred Shift(s)</TableHeaderCell>
                    <TableHeaderCell className='font-bold text-sm uppercase tracking-wide'>Preferred Location(s)</TableHeaderCell>
                    <TableHeaderCell className='font-bold text-sm uppercase tracking-wide'><span className="sr-only">Details</span></TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {candidates.map((candidate: any) => (
                    <TableRow key={candidate.id} className="hover:bg-tremor-background-muted hover:dark:bg-dark-tremor-background-muted">
                      <TableCell className='text-sm'>{candidate.first_name} {candidate.last_name}</TableCell>
                      <TableCell className='text-sm whitespace-normal'>{candidate.degree}</TableCell>
                      <TableCell className='text-sm whitespace-normal'>{candidate.specialty.join(', ')}</TableCell>
                      <TableCell className='text-sm whitespace-normal'>{candidate.preferred_shift.join(', ')}</TableCell>
                      <TableCell className='text-sm whitespace-normal'>{candidate.preferred_location.join(', ')}</TableCell>
                      <TableCell className="text-right">
                        <Button className='flex flex-nowrap  flex-row border border-red-700 hover:border-red-600  bg-red-700 rounded-md hover:bg-red-600 duration-700 transition  py-3 px-5 cursor-pointer' onClick={() => handleGetCandidateDetails(candidate)}>

                          <span className="flex items-center text-white text-sm leading-1">View</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

          </TabPanel>

          {/* Candidate Details */}
          <TabPanel>
            {selectedCandidate ? (
              <div className='flex flex-col gap-8 pb-4'>
                {/* Candidate Info */}
                <div className="bg-white rounded-lg p-0">
                  <div className="flex justify-between items-center mb-4 gap-4 mt-8">
                    <div className='space-y-2 border rounded-md border-gray-400 w-1/3 p-4 min-h-40'>
                      <h3 className="text-lg font-bold mb-2">{selectedCandidate.first_name} {selectedCandidate.last_name}</h3>
                      <p><strong>Email:</strong> {selectedCandidate.email}</p>
                      <p><strong>Phone:</strong> {selectedCandidate.phone}</p>
                      <p><strong>Notes:</strong> {selectedCandidate.misc_notes}</p>
                    </div>
                    <div className='space-y-2 border rounded-md border-gray-400 w-2/3 p-4 min-h-40'>
                      <p><strong>Degree:</strong> {selectedCandidate.degree}</p>
                      <p><strong>Specialties:</strong> {selectedCandidate.specialty.join(', ')}</p>
                      <p><strong>Preferred Shift:</strong> {selectedCandidate.preferred_shift.join(', ')}</p>
                      <p><strong>Preferred Location:</strong> {selectedCandidate.preferred_location.join(', ')}</p>
                    </div>
                  </div>
                </div>

                {/* Matching Jobs Grouped by Strength */}
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-bold text-2xl mb-2">Matching Jobs</h4>
                  {jobsLoading ? (
                    <div className="flex flex-col flex-nowrap justify-center items-center text-center h-full w-full">
                      <Skeleton width="100%" className="mb-4 min-h-30 min-w-full" />
                      <Skeleton width="100%" className="mb-4 min-h-30 min-w-full" />
                      <Skeleton width="100%" className="mb-4 min-h-30 min-w-full" />
                    </div>
                  ) : matchedJobs.length === 0 ? (
                    <p>No matching jobs found.</p>
                  ) : (
                    <>
                      <TabGroup index={activeMatchesTabIndex} onIndexChange={setActiveMatchesTabIndex}>
                        <TabList>
                          <Tab className={`px-4 py-2 text-sm cursor-pointer rounded-md ${activeMatchesTabIndex === 0 ? 'bg-green-500 text-white' : ''}`}>Perfect Matches</Tab>
                          <Tab className={`px-4 py-2 text-sm cursor-pointer rounded-md ${activeMatchesTabIndex === 1 ? 'bg-yellow-500 text-white' : ''}`}>Strong Matches</Tab>
                          <Tab className={`px-4 py-2 text-sm cursor-pointer rounded-md ${activeMatchesTabIndex === 2 ? 'bg-orange-500 text-white' : ''}`}>Possible Matches</Tab>
                          <Tab className={`px-4 py-2 text-sm cursor-pointer rounded-md ${activeMatchesTabIndex === 3 ? 'bg-red-600 text-white' : ''}`}>Weak Matches</Tab>
                        </TabList>
                        <TabPanels>
                          {/* Perfect Matches */}
                          <TabPanel>
                            {matchedJobs.filter(job => job.matchScore >= 9).map(job => (
                              <MatchedJobCard key={job.job_id} job={job} safeArray={safeArray} getMatchLabel={getMatchLabel} />
                            ))}
                          </TabPanel>
                          {/* Strong Matches */}
                          <TabPanel>
                            {matchedJobs.filter(job => job.matchScore >= 7 && job.matchScore < 9).map(job => (
                              <MatchedJobCard key={job.job_id} job={job} safeArray={safeArray} getMatchLabel={getMatchLabel} />
                            ))}
                          </TabPanel>
                          {/* Possible Matches */}
                          <TabPanel>
                            {matchedJobs.filter(job => job.matchScore >= 4 && job.matchScore < 7).map(job => (
                              <MatchedJobCard key={job.job_id} job={job} safeArray={safeArray} getMatchLabel={getMatchLabel} />
                            ))}
                          </TabPanel>
                          {/* Weak Matches */}
                          <TabPanel>
                            {matchedJobs.filter(job => job.matchScore < 4).map(job => (
                              <MatchedJobCard key={job.job_id} job={job} safeArray={safeArray} getMatchLabel={getMatchLabel} />
                            ))}
                          </TabPanel>
                        </TabPanels>
                      </TabGroup>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <p>Select a candidate to view details.</p>
            )}
          </TabPanel>
          {/*<TabPanel>*/}
          {/*  {selectedCandidate ? (*/}
          {/*    <div className='flex flex-col gap-8 pb-4'>*/}
          {/*      <div className="bg-white rounded-lg p-0">*/}
          {/*        <div className="flex justify-between items-center mb-4 gap-4 mt-8">*/}
          {/*          <div className='space-y-2 border rounded-md border-gray-400 w-1/3 p-4 min-h-40'>*/}
          {/*            <h3 className="text-lg font-bold mb-2">{selectedCandidate.first_name} {selectedCandidate.last_name}</h3>*/}
          {/*            <p><strong>Email:</strong> {selectedCandidate.email}</p>*/}
          {/*            <p><strong>Phone:</strong> {selectedCandidate.phone}</p>*/}
          {/*            <p><strong>Notes:</strong> {selectedCandidate.misc_notes}</p>*/}
          {/*          </div>*/}
          {/*          <div className='space-y-2 border rounded-md border-gray-400 w-2/3 p-4 min-h-40'>*/}
          {/*            <p><strong>Degree:</strong> {selectedCandidate.degree}</p>*/}
          {/*            <p><strong>Specialties:</strong> {selectedCandidate.specialty.join(', ')}</p>*/}
          {/*            <p><strong>Preferred Shift:</strong> {selectedCandidate.preferred_shift.join(', ')}</p>*/}
          {/*            <p><strong>Preferred Location:</strong> {selectedCandidate.preferred_location.join(', ')}</p>*/}
          {/*          </div>*/}
          {/*        </div>*/}
          {/*      </div>*/}
          {/*      <div className="bg-white rounded-lg p-0">*/}
          {/*        <div className="mt-4">*/}
          {/*          <h4 className="font-bold text-2xl mb-2">Matching Jobs</h4>*/}
          {/*          {jobsLoading ? (*/}
          {/*            <div className="flex flex-col flex-nowrap justify-center items-center text-center h-full w-full">*/}
          {/*              <Skeleton width="100%" className="mb-4 min-h-30 min-w-full" />*/}
          {/*              <Skeleton width="100%" className="mb-4 min-h-30 min-w-full" />*/}
          {/*              <Skeleton width="100%" className="mb-4 min-h-30 min-w-full" />*/}
          {/*            </div>*/}
          {/*          ) : (*/}
          {/*            <>*/}
          {/*              {matchedJobs.length === 0 ? (*/}
          {/*                <p>No matching jobs found.</p>*/}
          {/*              ) : (*/}
          {/*                <>*/}
          {/*                  {matchedJobs.map(job => (*/}
          {/*                    <div key={job.job_id} className="p-3 border rounded mb-2">*/}
          {/*                      <span className='text-[10px] text-gray-600'><strong>ID: </strong>{job.job_id}</span>*/}
          {/*                      <div className="flex justify-between">*/}
          {/*                        <strong>{job.job_title}</strong>*/}
          {/*                        <Link href={`/job/${job.job_id}`} className='flex items-center justify-center gap-1 text-center px-4 py-2 rounded-md transition cursor-pointer text-[13px] duration-700 text-white  bg-linear-to-br from-red-600 to-red-800'>*/}
          {/*                          <ImInfo  color="white" size={16}/>*/}
          {/*                          <span className="flex items-center text-white text-xs leading-1">View Job Details</span>*/}
          {/*                        </Link>*/}
          {/*                      </div>*/}
          {/*                      <div className="text-sm mt-1">*/}
          {/*                        <span>{safeArray(job.job_specialty).join(", ")} | {" "} {safeArray(job.job_shift).join(", ")} | {" "} {job.job_city ? job.job_city + ", " : ""} {safeArray(job.job_state).join(", ")}</span>*/}
          {/*                      </div>*/}
          {/*                      <div className='max-w-32 mt-4 ml-[-2px]'>*/}
          {/*                        {getMatchLabel(job.matchScore)}*/}
          {/*                      </div>*/}

          {/*                    </div>*/}
          {/*                  ))}*/}
          {/*                </>*/}
          {/*              )}*/}
          {/*            </>*/}
          {/*          )}*/}

          {/*        </div>*/}
          {/*      </div>*/}
          {/*    </div>*/}
          {/*  ) : (*/}
          {/*    <p>Select a candidate to view details.</p>*/}
          {/*  )}*/}
          {/*</TabPanel>*/}

          {/* Add New Candidate */}
          <TabPanel>

            <form
              className='mt-4 flex flex-col gap-5 w-full'
              onSubmit={handleUpdateAddCandidate}
            >
              <div className='flex flex-row gap-2 w-full'>
                <div className='flex flex-col w-full'>
                  <label
                    className='text-gray-700 p-1 block'
                    htmlFor='username'
                  >
                    First Name
                  </label>
                  <input
                    type='text'
                    name='first_name'
                    value={addCandidateForm?.first_name}
                    onChange={handleAddCandidateFormChange}
                    className='w-full border p-2 rounded '
                  />
                </div>
                <div className='flex flex-col w-full'>
                  <label
                    className='text-gray-700 p-1 block'
                    htmlFor='username'
                  >
                    Last Name
                  </label>
                  <input
                    type='text'
                    name='last_name'
                    value={addCandidateForm?.last_name}
                    onChange={handleAddCandidateFormChange}
                    className='w-full border p-2 rounded'
                  />
                </div>
              </div>

              <div className='flex flex-row gap-2 w-full'>
                <div className='flex flex-col w-full'>
                  <label
                    className='text-gray-700 p-1 block'
                    htmlFor='username'
                  >
                    Email
                  </label>
                  <input
                    type='email'
                    name='email'
                    value={addCandidateForm?.email}
                    onChange={handleAddCandidateFormChange}
                    className='w-full border p-2 rounded'
                  />
                </div>
                <div className='flex flex-col w-full'>
                  <label
                    className='text-gray-700 p-1 block'
                    htmlFor='username'
                  >
                    Phone
                  </label>
                  <input
                    type='tel'
                    name='phone'
                    value={addCandidateForm?.phone}
                    onChange={handleAddCandidateFormChange}
                    className='w-full border p-2 rounded'
                  />
                </div>
              </div>

              <div className='flex flex-row gap-2 w-full'>
                <div className='flex flex-col w-1/2'>
                  <label
                    className='text-gray-700 p-1 block'
                    htmlFor='username'
                  >
                    Degree/Modality
                  </label>
                  <select
                    name='degree'
                    value={addCandidateForm?.degree}
                    onChange={handleAddCandidateFormChange}
                    className='w-full border p-2 rounded bg-white'
                  >
                    <option value=''>Select Degree</option>
                    <option value='LPN'>RN</option>
                    <option value='ADN'>Allied</option>
                  </select>
                </div>

              </div>


              <div className="flex flex-col w-full">
                <label className="text-gray-700 p-1 block">
                  Specialty/Specialties
                </label>

                <MultiSelect
                  value={addCandidateForm.specialty}
                  options={specialtyOptions}
                  onChange={(e) =>
                    setAddCandidateForm({
                      ...addCandidateForm,
                      specialty: e.value
                    })
                  }
                  placeholder="Select Specialties"
                  className="w-full"
                  display="chip"
                  filter
                  showClear
                />
              </div>

              <div className="flex flex-col w-full">
                <label className="text-gray-700 p-1 block">
                  Preferred Shift(s)
                </label>

                <MultiSelect
                  value={addCandidateForm.preferred_shift}
                  options={shiftOptions}
                  onChange={(e) =>
                    setAddCandidateForm({
                      ...addCandidateForm,
                      preferred_shift: e.value
                    })
                  }
                  placeholder="Select Shifts"
                  className="w-full"
                  display="chip"
                />
              </div>

              <div className="flex flex-col w-full">
                <label className="text-gray-700 p-1 block">
                  Preferred Location(s)
                </label>

                <MultiSelect
                  value={addCandidateForm.preferred_location}
                  options={stateOptions}
                  onChange={(e) =>
                    setAddCandidateForm({
                      ...addCandidateForm,
                      preferred_location: e.value
                    })
                  }
                  placeholder="Select States"
                  className="w-full "
                  display="chip"
                  filter
                  showClear
                />
              </div>


              <div className='flex justify-end gap-[20px]'>
                <button
                  type='submit'
                  disabled={addCandidateFormLoading}
                  className='flex items-center justify-center gap-1 text-center px-4 py-2 border border-red-700 hover:border-red-600  bg-red-700 rounded-md hover:bg-red-600 duration-700 transition cursor-pointer text-[13px]'
                >
                  <FaUserCheck color="white" size={16}  />
                  <span className="flex items-center text-white text-xs">{addCandidateFormLoading ? 'Adding...' : 'Add Candidate'}</span>
                </button>
              </div>
            </form>
          </TabPanel>
        </TabPanels>
      </TabGroup>
      <ToastContainer/>
    </>
  );
}