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
import { createUserWithEmailAndPassword } from "firebase/auth";
import {Skeleton} from "primereact/skeleton";
import {Slide, toast, ToastContainer} from "react-toastify";
import {MultiSelect} from "primereact/multiselect";
import {FaUserCheck} from "react-icons/fa";
import { Badge } from 'primereact/badge';
import {MatchedJobCard} from "@/components/MatchedJobCard";
import { Password } from 'primereact/password';
import {InputSwitch} from "primereact/inputswitch";
import {RadioButton} from "primereact/radiobutton";
import { auth } from "@/lib/firebase";
import CandidateChecklistResults from "@/components/CandidateChecklistResults";

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
  id: number;
  firebase_uid: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  password: string;
  preferred_location: string[];
  preferred_shift: string[];
  degree: string;
  specialty: string[];
  states_licensure: string[];
  years_experience: string;
  misc_notes: string;
  recruiter_name: string;
  recruiter_email: string;
  role: string;
  email_notifications: number;
  recruiter_firebase_uid: string | undefined;
}

export default function RecruiterCandidatesList() {
  const { user, role, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [matchedJobs, setMatchedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMatchesTabIndex, setActiveMatchesTabIndex] = useState(0);
  const [activeTabIndex, setActiveTabIndex] = useState(0); // first tab active by default
  const [jobsLoading, setJobsLoading] = useState(false);
  const [candidatesLoading, setCandidatesLoading] = useState(false);
  const [addCandidateFormLoading, setAddCandidateFormLoading] = useState(false);
  const [specialtyOptions, setSpecialtyOptions] = useState<any[]>([]);
  const [status, setStatus] = useState<any>('');
  const [editCandidateModalOpen, setEditCandidateModalOpen] = useState(false);
  const [editCandidateForm, setEditCandidateForm] = useState<AddCandidateForm | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState<{ id: number; name: string } | null>(null);
  const [skillsChecklistsVisible, setSkillsChecklistsVisible] = useState(false);

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
        "https://adextravelnursing.com/api_get_candidates.php",
        { params: { uid: user?.uid } }
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
      <Badge value="Perfect Match!" severity="success" className='text-xs'></Badge>
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
    { label: "Days", value: "Days" },
    { label: "Nights", value: "Nights" },
    { label: "Weekends", value: "Weekends" },
    { label: "Rotating", value: "Rotating" },
    { label: "Flex", value: "Flex" },
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
    id: 0,
    firebase_uid: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    password: '',
    preferred_location: [],
    preferred_shift: [],
    degree: '',
    specialty: [],
    states_licensure: [],
    years_experience: '',
    misc_notes: '',
    recruiter_name: '',
    recruiter_email: '',
    role: 'candidate',
    email_notifications: 1,
    recruiter_firebase_uid: user?.uid,
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
        recruiter_firebase_uid: user.uid
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
      const payload = {
        ...addCandidateForm,
        recruiter_firebase_uid: user?.uid,
        recruiter_name: userData?.first_name,
        recruiter_email: userData?.email,
      };

      const res = await axios.post(
        "https://adextravelnursing.com/api_recruiter_add_candidate.php",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.data.status === "success") {
        toast.success('Candidate created successfully!',{
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

        setAddCandidateForm({
          id: 0,
          firebase_uid: "",
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          city: "",
          state: "",
          password: "",
          preferred_location: [],
          preferred_shift: [],
          degree: "",
          specialty: [],
          states_licensure: [],
          years_experience: "",
          misc_notes: "",
          recruiter_name: "",
          recruiter_email: "",
          role: "candidate",
          email_notifications: 1,
          recruiter_firebase_uid: user?.uid,
        });

        fetchCandidates();
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
      toast.error("Something went wrong",{
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

  const confirmDeleteCandidate = async () => {
    if (!candidateToDelete) return;

    try {
      await axios.post(
        "https://adextravelnursing.com/api_delete_candidate.php",
        { candidate_id: candidateToDelete.id },
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success(`Candidate ${candidateToDelete.name} deleted successfully!`,{
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
      fetchCandidates(); // refresh candidate list
      setSelectedCandidate(null); // clear details tab
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete candidate.',{
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
      setIsDeleteModalOpen(false);
      setCandidateToDelete(null);
    }
  };

  return (
    <>
      <TabGroup index={activeTabIndex} onIndexChange={setActiveTabIndex} className="mt-2">
        <TabList className='mb-6'>
          <Tab className={`px-4 py-2 cursor-pointer rounded-md ${activeTabIndex === 0 ? 'bg-sky-900 text-white' : ''}`}>Candidates</Tab>
          <Tab className={`px-4 py-2 cursor-pointer rounded-md ${activeTabIndex === 1 ? 'bg-sky-900  text-white' : ''}`} disabled={!selectedCandidate}>Details</Tab>
          <Tab className={`px-4 py-2 cursor-pointer rounded-md ${activeTabIndex === 2 ? 'bg-sky-900  text-white' : ''}`}>Add New</Tab>
        </TabList>
        <TabPanels>
          {/* Candidates List */}
          <TabPanel>
            <div className='border rounded-md border-gray-100 w-full p-4 min-h-40 bg-white shadow'>
              <h2 className="text-lg font-bold">Candidates</h2>
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
            </div>
          </TabPanel>
          {/* Candidate Details */}
          <TabPanel>
            {selectedCandidate ? (
              <div className='flex flex-col gap-8 pb-4'>
                {/* Candidate Info */}
                <div className=" rounded-lg p-0">
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <div className='space-y-2 border rounded-md border-gray-100 w-4/12 p-4 min-h-40 bg-white shadow'>
                      <span className='text-[10px] text-gray-600'><strong>ID: </strong>{selectedCandidate.id}</span>
                      <h3 className="text-lg font-bold mb-2">{selectedCandidate.first_name} {selectedCandidate.last_name}</h3>
                      <p><strong>Email:</strong> {selectedCandidate.email}</p>
                      <p><strong>Phone:</strong> {selectedCandidate.phone}</p>
                      <p><strong>Notes:</strong> {selectedCandidate.misc_notes}</p>

                    </div>
                    <div className='space-y-2 border rounded-md border-gray-100 w-6/12 p-4 min-h-40 bg-white shadow'>
                      <p><strong>Degree:</strong> {selectedCandidate.degree}</p>
                      <p><strong>Specialties:</strong> {selectedCandidate.specialty.join(', ')}</p>
                      <p><strong>Preferred Shift:</strong> {selectedCandidate.preferred_shift.join(', ')}</p>
                      <p><strong>Preferred Location:</strong> {selectedCandidate.preferred_location.join(', ')}</p>
                    </div>
                    <div className='gap-2 w-2/12 min-h-40 border rounded-md border-gray-100 p-4 min-h-40 bg-white shadow'>
                      <div className="flex flex-col gap-2 ">
                        <Button
                          className="bg-sky-900 hover:bg-sky-800 text-white px-4 py-2 rounded-md cursour-pointer"
                          onClick={() => {
                            setEditCandidateForm({ ...selectedCandidate }); // populate form with current candidate data
                            setEditCandidateModalOpen(true);
                          }}
                        >
                          Edit Candidate
                        </Button>
                        {skillsChecklistsVisible ? (
                          <Button
                            className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-md cursor-pointer"
                            onClick={() => {
                              setSkillsChecklistsVisible(false);
                            }}
                          >
                            Matched Jobs
                          </Button>
                        ):(
                          <Button
                            className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-md cursor-pointer"
                            onClick={() => {
                              setSkillsChecklistsVisible(true);
                            }}
                          >
                            Skills Checklists
                          </Button>
                        )}

                        <Button
                          className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-md cursor-pointer"
                          onClick={() => {
                            setCandidateToDelete({ id: selectedCandidate.id, name: `${selectedCandidate.first_name} ${selectedCandidate.last_name}` });
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          Delete Candidate
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>


                {/* Matching Jobs Grouped by Strength */}
                <div className="">
                  {skillsChecklistsVisible ? (
                    <CandidateChecklistResults candidateUid={selectedCandidate.firebase_uid} candidateName={selectedCandidate.first_name+' '+selectedCandidate.last_name}/>
                  ) : (
                    <>
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
                            <TabList className='mb-6'>
                              <Tab className={`px-4 py-2 text-sm cursor-pointer rounded-md ${activeMatchesTabIndex === 0 ? 'bg-[#21C55E] text-white' : ''}`}>Perfect Matches</Tab>
                              <Tab className={`px-4 py-2 text-sm cursor-pointer rounded-md ${activeMatchesTabIndex === 1 ? 'bg-[#F59E0B] text-white' : ''}`}>Strong Matches</Tab>
                              <Tab className={`px-4 py-2 text-sm cursor-pointer rounded-md ${activeMatchesTabIndex === 2 ? 'bg-[#FA7315] text-white' : ''}`}>Possible Matches</Tab>
                              <Tab className={`px-4 py-2 text-sm cursor-pointer rounded-md ${activeMatchesTabIndex === 3 ? 'bg-[#EF4444] text-white' : ''}`}>Weak Matches</Tab>
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
                    </>
                  )}

                </div>
              </div>
            ) : (
              <p>Select a candidate to view details.</p>
            )}
          </TabPanel>
          {/* Add New Candidate */}
          <TabPanel>
            <div className='space-y-2 border rounded-md border-gray-100  p-4 min-h-40 bg-white shadow'>
              <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-bold">Add New Candidate</h2>
              </div>
            <form
              className='mt-4 flex flex-col gap-5 w-full'
              onSubmit={handleUpdateAddCandidate}
            >
              <div className="flex justify-center items-center px-2 pt-1 pb-2 w-45 rounded-md bg-linear-to-br from-cyan-600 to-cyan-700 -ml-0.5 mt-4 -mb-2">
                <span className="text-white text-[11px] leading-3 mt-1  font-medium uppercase tracking-widest">BASIC INFORMATION</span>
              </div>
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
                    className='w-full border p-2 rounded border-gray-400'
                    required
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
                    className='w-full border p-2 rounded border-gray-400'
                    required
                  />
                </div>
              </div>

              <div className='flex flex-row gap-2 w-full'>
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
                    className='w-full border p-2 rounded border-gray-400'
                    required
                  />
                </div>
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
                    className='w-full border p-2 rounded border-gray-400'
                    required
                  />
                </div>
                <div className='flex flex-col w-full'>
                  <label
                    className='text-gray-700 p-1 block'
                    htmlFor='city'
                  >
                    Password
                  </label>
                  <Password
                    name='password'
                    value={addCandidateForm?.password}
                    onChange={handleAddCandidateFormChange}
                    toggleMask

                    pt={{
                      root: { className: "p-0 text-sm leading-none w-full border-gray-400" },
                      input: { className: "border-gray-400" },
                    }}
                  />
                </div>
              </div>

              <div className='flex flex-row gap-2 w-full'>
                <div className='flex flex-col w-full'>
                  <label
                    className='text-gray-700 p-1 block'
                    htmlFor='city'
                  >
                    City
                  </label>
                  <input
                    type='text'
                    name='city'
                    value={addCandidateForm?.city}
                    onChange={handleAddCandidateFormChange}
                    className='w-full border p-2 rounded border-gray-400'
                    required
                  />
                </div>
                <div className='flex flex-col w-full'>
                  <label
                    className='text-gray-700 p-1 block'
                    htmlFor='state'
                  >
                    State
                  </label>
                  <select
                    name='state'
                    value={addCandidateForm?.state}
                    required
                    onChange={handleAddCandidateFormChange}
                    className='w-full border p-2 rounded bg-white border-gray-400'
                  >
                    <option value="">Select State...</option>
                    {stateOptions.map((state) => (
                      <option key={state.value} value={state.value}>
                        {state.label}
                      </option>
                    ))}
                  </select>
              </div>
              </div>


              <div className="flex justify-center items-center px-2 pt-1 pb-2 w-45 rounded-md bg-linear-to-br from-cyan-600 to-cyan-700 -ml-0.5 mt-6 -mb-2">
                <span className="text-white text-[11px] leading-3 mt-1  font-medium uppercase tracking-widest">WORK EXPERIENCE</span>
              </div>

              {/*DEGREE / MODALITY*/}
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
                    required
                    onChange={handleAddCandidateFormChange}
                    className='w-full border p-2 rounded bg-white border-gray-400'
                  >
                    <option value=''>Select Degree</option>
                    <option value='RN'>RN</option>
                    <option value='Allied'>Allied</option>
                    <option value='Therapy'>Therapy</option>
                    <option value='LPN'>LPN</option>
                  </select>
                </div>

              </div>
              {/*SPECIALTIES MULTISELECT*/}
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
                  required
                  showClear
                  pt={{
                    root: { className: "p-0 text-sm leading-none w-full border-gray-400" },
                  }}
                />
              </div>
              {/*YEARS OF EXPERIENCE*/}
              <div className='flex flex-row gap-2 w-full'>
                <div className='flex flex-col w-1/2'>
                  <label
                    className='text-gray-700 p-1 block'
                    htmlFor='years_experience'
                  >
                    Years of Experience
                  </label>
                  <select
                    name='years_experience'
                    value={addCandidateForm?.years_experience}
                    required
                    onChange={handleAddCandidateFormChange}
                    className='w-full border p-2 rounded bg-white border-gray-400'
                  >
                    <option value="">Select Years of Experience</option>
                    <option value="0-1 Years">0-1 Years</option>
                    <option value="2-3 Years">2-3 Years</option>
                    <option value="4-5 Years">4-5 Years</option>
                    <option value="6-10 Years">6-10 Years</option>
                    <option value="10+ Years">10+ Years</option>
                  </select>
                </div>

              </div>
              {/*STATES LICENSURE MULTISELECT */}
              <div className="flex flex-col w-full">
                <label className="text-gray-700 p-1 block">
                  States in which licensure is held
                </label>

                <MultiSelect
                  value={addCandidateForm.states_licensure}
                  options={stateOptions}
                  onChange={(e) =>
                    setAddCandidateForm({
                      ...addCandidateForm,
                      states_licensure: e.value
                    })
                  }
                  placeholder="Select States"
                  className="w-full"
                  display="chip"
                  filter
                  required
                  showClear
                  pt={{
                    root: { className: "p-0 text-sm leading-none w-full border-gray-400" },
                    label: { className: "p-0 text-sm leading-none w-full border-gray-400" },
                  }}
                />
              </div>

              <div className="flex justify-center items-center px-2 pt-1 pb-2 w-45 rounded-md bg-linear-to-br from-cyan-600 to-cyan-700 -ml-0.5 mt-6 -mb-2">
                <span className="text-white text-[11px] leading-3 mt-1  font-medium uppercase tracking-widest">JOB MATCHING</span>
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
                  required
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
                  required
                  display="chip"
                  filter
                  showClear
                />
              </div>

              <div className="flex flex-col w-full">
                <label className="text-gray-700 p-1 block font-bold mb-2">
                 Enable Email Notifications
                </label>
                <div className="flex flex-wrap items-center leading-5 gap-3">
                  <div className="flex align-items-center">
                    <RadioButton
                      checked
                      inputId="email_notifications_toggle1"
                      name="email_notifications"
                      value="1"
                      onChange={(e) =>
                        setAddCandidateForm({
                          ...addCandidateForm,
                          email_notifications: e.value
                        })
                      }
                      />
                    <label htmlFor="email_notifications_toggle1" className="ml-2">Enabled</label>
                  </div>
                  <div className="flex align-items-center">
                    <RadioButton
                      inputId="email_notifications_toggle1"
                      name="email_notifications"
                      value="0"
                      onChange={(e) =>
                        setAddCandidateForm({
                          ...addCandidateForm,
                          email_notifications: e.value
                        })
                      }
                    />
                    <label htmlFor="email_notifications_toggle1" className="ml-2">Disabled</label>
                  </div>


                </div>

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
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
      {editCandidateModalOpen && editCandidateForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.7)] z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-3xl space-y-4">
            <h3 className="text-lg font-bold">Edit Candidate</h3>

            <input
              type="text"
              placeholder="First Name"
              name="first_name"
              value={editCandidateForm.first_name}
              onChange={(e) =>
                setEditCandidateForm({ ...editCandidateForm, first_name: e.target.value })
              }
              className="border p-2 w-full rounded"
            />

            <input
              type="text"
              placeholder="Last Name"
              name="last_name"
              value={editCandidateForm.last_name}
              onChange={(e) =>
                setEditCandidateForm({ ...editCandidateForm, last_name: e.target.value })
              }
              className="border p-2 w-full rounded"
            />

            <input
              type="email"
              placeholder="Email"
              name="email"
              value={editCandidateForm.email}
              onChange={(e) =>
                setEditCandidateForm({ ...editCandidateForm, email: e.target.value })
              }
              className="border p-2 w-full rounded"
            />

            <input
              type="tel"
              placeholder="Phone"
              name="phone"
              value={editCandidateForm.phone}
              onChange={(e) =>
                setEditCandidateForm({ ...editCandidateForm, phone: e.target.value })
              }
              className="border p-2 w-full rounded"
            />

            <MultiSelect
              value={editCandidateForm.specialty}
              options={specialtyOptions}
              onChange={(e) =>
                setEditCandidateForm({ ...editCandidateForm, specialty: e.value })
              }
              placeholder="Select Specialties"
              className="w-full"
              display="chip"
              filter
              showClear
            />

            <MultiSelect
              value={editCandidateForm.preferred_shift}
              options={shiftOptions}
              onChange={(e) =>
                setEditCandidateForm({ ...editCandidateForm, preferred_shift: e.value })
              }
              placeholder="Select Shifts"
              className="w-full"
              display="chip"
            />

            <MultiSelect
              value={editCandidateForm.preferred_location}
              options={stateOptions}
              onChange={(e) =>
                setEditCandidateForm({ ...editCandidateForm, preferred_location: e.value })
              }
              placeholder="Select States"
              className="w-full"
              display="chip"
              filter
              showClear
            />

            <div className="flex justify-end gap-2 mt-4">
              <Button
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md"
                onClick={() => setEditCandidateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-sky-900 hover:bg-sky-800 text-white px-4 py-2 rounded-md"
                onClick={async () => {
                  if (!editCandidateForm) return;
                  try {
                    await axios.post(
                      "https://adextravelnursing.com/api_update_candidate.php",
                      editCandidateForm,
                      { headers: { "Content-Type": "application/json" } }
                    );
                    toast.success('Candidate updated successfully!',{
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
                    setEditCandidateModalOpen(false);
                    fetchCandidates(); // refresh list
                    if (selectedCandidate?.id === editCandidateForm.id) {
                      setSelectedCandidate(editCandidateForm); // update details view
                    }
                  } catch (err) {
                    console.error(err);
                    toast.error('Failed to update candidate.',{
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
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
      {isDeleteModalOpen && candidateToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-md p-6 w-96 shadow-lg space-y-4">
            <h3 className="text-lg font-bold">Confirm Delete</h3>
            <p>Are you sure you want to delete <strong>{candidateToDelete.name}</strong>? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <Button
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                onClick={confirmDeleteCandidate}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer/>
    </>
  );
}