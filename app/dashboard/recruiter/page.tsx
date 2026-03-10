'use client'
import InnerPageTitle from "@/app/sections/InnerPageTitle";
import moment from "moment/moment";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {useRouter} from "next/navigation";
import {useAuth} from "@/context/AuthContext";
import {PiGear, PiListChecksBold, PiReadCvLogoBold} from "react-icons/pi";
import {ImLifebuoy} from "react-icons/im";
import {ToastContainer, toast, Slide} from 'react-toastify';
import Link from "next/link";
import {FaEye, FaRegTrashAlt, FaUserCheck} from "react-icons/fa";
import { IoPersonAdd } from "react-icons/io5";
import { MdGroups } from "react-icons/md";
import {AiOutlineSend} from "react-icons/ai";
import Select from "react-select";
import { MultiSelect } from "primereact/multiselect";
import {FaRegCalendarDays} from "react-icons/fa6";
import MyCalendar from "@/components/MyCalendar";

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
  firebase_uid: string | undefined;
}

export default function RecruiterDashboard() {
  const { user, role,  loading: authLoading } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [errors, setErrors] = useState<any[]>([]);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [candidatesVisible, setCandidatesVisible] = useState(true);
  const [addCandidateVisible, setAddCandidateVisible] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [addCandidateFormLoading, setAddCandidateFormLoading] = useState(false);

  // useEffect(() => {
  //   if (role && role !== "recruiter") {
  //     router.push("/dashboard");
  //   }
  // }, [role]);
  //
  // if (role !== "recruiter") return null;



  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading]);

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

  const fetchCandidates = async () => {
    if (!user) return;

    try {
      const res = await axios.get(
        "https://adextravelnursing.com/api_get_candidates.php",
        { params: { uid: user.uid } }
      );

      setCandidates(Array.isArray(res.data) ? res.data : [res.data]);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchCandidates();
  }, [user]);

  const specialtyOptions = [
    { label: "ICU", value: "ICU" },
    { label: "ER", value: "ER" },
    { label: "Med-Surg", value: "Med-Surg" },
    { label: "Telemetry", value: "Telemetry" },
    { label: "Pediatrics", value: "Pediatrics" },
  ];
  const shiftOptions = [
    { label: "Day", value: "Day" },
    { label: "Night", value: "Night" },
    { label: "Weekends", value: "Weekends" },
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
    firebase_uid: user?.uid,
  });
  const handleAddCandidateFormChange = (e: any) => {
    setAddCandidateForm({
      ...addCandidateForm,
      [e.target.name]: e.target.value,
    });
  };
  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(e.target.selectedOptions, option => option.value);

    setAddCandidateForm(prev => ({
      ...prev,
      [e.target.name]: values
    }));
  };
  const handleUpdateAddCandidate = async (e: any) => {
    e.preventDefault();
    setAddCandidateFormLoading(true);
    try {
      await axios.post(
        'https://adextravelnursing.com/api_add_new_candidate.php',
        addCandidateForm
      );
    } catch (err:any) {
      setErrors(err);
      addCandidateFormErrorToast();
      setAddCandidateFormLoading(false);
      return;
    }

    setAddCandidateFormLoading(false);
    addCandidateFormUpdatedToast();
    fetchCandidates();

  };
  const addCandidateFormUpdatedToast = () => toast.success('Candidate Added!', {
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
  const addCandidateFormErrorToast = () => toast.error('Error Adding Candidate:'+errors, {
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

  const handleSettingsVisibility = () => {
    setCandidatesVisible(false)
    setSettingsVisible(true);
    setAddCandidateVisible(false);
    setCalendarVisible(false);
  }
  const handleCandidatesVisibility = () => {
    setCandidatesVisible(true)
    setSettingsVisible(false);
    setAddCandidateVisible(false);
    setCalendarVisible(false);
  }
  const handleAddCandidateVisibility = () => {
    setCandidatesVisible(false)
    setSettingsVisible(false);
    setAddCandidateVisible(true);
    setCalendarVisible(false);
  }
  const handleCalendarVisibility = () => {
    setCandidatesVisible(false)
    setSettingsVisible(false);
    setAddCandidateVisible(false);
    setCalendarVisible(true);
  }

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-red-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      {/*<InnerPageTitle title='Dashboard' subHeading='Recruiter' />*/}
      <div className="bg-gray-100 pt-2 pb-12">
        <section className="mt-12 max-w-full mx-auto md:px-8 min-h-screen">
          <div className="flex justify-between items-start gap-4 flex-wrap md:flex-nowrap px-4 md:px-0">

            {/*DASHBOARD LEFT*/}
            <div className="flex flex-col items-start justify-between gap-2 bg-white rounded-lg p-6 shadow-lg w-full md:w-[20%] min-w-60 max-w-70 h-screen max-h-[80vh]" >
              <div className=" w-full">
                <h3 className="text-gray-800 text-xl font-semibold mb-2">
                  {userData?.first_name} {userData?.last_name}
                </h3>

                <hr className='bg-black w-full h-0.5 mb-1 opacity-20'/>
                <div className="flex flex-col items-start justify-start gap-2 pt-5">
                  <button
                    onClick={handleCandidatesVisibility}
                    className="flex items-center justify-start gap-1 w-full stext-center px-4 py-1 rounded-md transition cursor-pointer text-[12px] font-medium duration-700 text-white border border-sky-800 hover:border-sky-700 hover:bg-sky-700 bg-sky-800">
                    <MdGroups  size={16} className=""/>
                    <span>My Candidates</span>
                  </button>
                  <button
                    onClick={handleAddCandidateVisibility}
                    className="flex items-center justify-start gap-1 w-full stext-center px-4 py-1 rounded-md transition cursor-pointer text-[12px] font-medium duration-700 text-white border border-sky-800 hover:border-sky-700 hover:bg-sky-700 bg-sky-800">
                    <IoPersonAdd  size={16} className=""/>
                    <span>Add New Candidate</span>
                  </button>
                  <button
                    onClick={handleCalendarVisibility}
                    className="flex items-center justify-start gap-1 w-full stext-center px-4 py-1 rounded-md transition cursor-pointer text-[12px] font-medium duration-700 text-white border border-sky-800 hover:border-sky-700 hover:bg-sky-700 bg-sky-800">
                    <FaRegCalendarDays  size={16} className=""/>
                    <span>My Calendar</span>
                  </button>
                  <button
                    onClick={handleSettingsVisibility}
                    className="flex items-center justify-start gap-1 w-full stext-center px-4 py-1 rounded-md transition cursor-pointer text-[12px] font-medium duration-700 text-white border border-sky-800 hover:border-sky-700 hover:bg-sky-700 bg-sky-800">
                    <PiGear  size={16} className=""/>
                    <span>Settings</span>
                  </button>
                </div>
              </div>
              <div className="mt-3">
                <Link href='contact/' className='w-full flex items-start justify-start gap-1 text-xs  text-blue-900 rounded-lg  transition cursor-pointer'>
                  <ImLifebuoy size={18} className="text-blue-900"/>
                  <span>Need Help?</span>
                </Link>

              </div>
            </div>

            {/*DASHBOARD RIGHT*/}
            <div className="flex flex-col items-start justify-start gap-4 w-full md:w-[80%]" >

              {/*PANEL: SAVED JOBS*/}
              {candidatesVisible && (
                <div className="flex flex-col items-start justify-start gap-2 bg-white rounded-lg p-4 shadow-lg w-full">
                  <h3 className="text-gray-800 text-md font-black mb-2">
                    My Candidates
                  </h3>
                  <div className="min-w-full">
                    <div
                      className="overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-none [&::-webkit-scrollbar-track]:bg-scrollbar-track [&::-webkit-scrollbar-thumb]:bg-scrollbar-thumb">
                      <table className="min-w-full divide-y divide-table-line">
                        <thead>
                        <tr>
                          <th scope="col"
                              className=" pr-2 py-3 text-start text-[10px] md:text-xs font-bold text-muted-foreground-1 uppercase">Name
                          </th>
                          <th scope="col"
                              className=" pr-2 py-3 text-start text-[10px] md:text-xs font-bold text-muted-foreground-1 uppercase">Email
                          </th>
                          <th scope="col"
                              className=" pr-2 py-3 text-start text-[10px] md:text-xs font-bold text-muted-foreground-1 uppercase">Phone
                          </th>
                          <th scope="col"
                              className="py-3 pr-2 text-start text-[10px] md:text-xs font-bold text-muted-foreground-1 uppercase">Degree
                          </th>
                          <th scope="col"
                              className="py-3 pr-2 text-start text-[10px] md:text-xs font-bold text-muted-foreground-1 uppercase">Specialty
                          </th>
                          <th scope="col"
                              className="hidden md:block py-3 pr-2 text-start text-[10px] md:text-xs font-bold text-muted-foreground-1 uppercase">Preferred Location
                          </th>
                          <th scope="col"
                              className="py-3 pr-2 text-start text-[10px] md:text-xs font-bold text-muted-foreground-1 uppercase">Preferred Shift
                          </th>
                          <th scope="col"
                              className="py-3 pr-2 text-start text-[10px] md:text-xs font-bold text-muted-foreground-1 uppercase">Date Added
                          </th>
                          <th scope="col"
                              className="py-3 text-start text-[10px] md:text-xs font-bold text-muted-foreground-1 uppercase">Actions
                          </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-table-line">
                        {candidates.map((candidate: any) => (
                          <tr key={candidate.id}>
                            <td className="py-4 pr-2 whitespace-wrap  text-[10px] md:text-xs text-foreground">{candidate.first_name} {candidate.last_name}</td>
                            <td className="py-4 pr-2 whitespace-wrap  text-[10px] md:text-xs text-foreground">{candidate.email}</td>
                            <td className="py-4 pr-2 whitespace-wrap  text-[10px] md:text-xs text-foreground">{candidate.phone}</td>
                            <td className="py-4 pr-2 whitespace-wrap  text-[10px] md:text-xs text-foreground">{candidate.degree}</td>
                            <td className="py-4 pr-2 whitespace-wrap  text-[10px] md:text-xs text-foreground">{candidate.specialty}</td>
                            <td className="py-4 pr-2 whitespace-wrap  text-[10px] md:text-xs text-foreground">{candidate.preferred_location}</td>
                            <td className="py-4 pr-2 whitespace-wrap  text-[10px] md:text-xs text-foreground">{candidate.preferred_shift}</td>
                            <td className="py-4 pr-2 whitespace-wrap  text-[10px] md:text-xs text-foreground">{moment(candidate.created_at).format('MM/DD/YY')}</td>
                            <td className="py-4  whitespace-wrap md:whitespace-nowrap  text-center  text-[10px] md:text-xs font-medium">
                              <div className="flex items-center justify-center gap-2">
                                <Link href="" className='text-xs font-semibold text-cyan-600 cursor-pointer  focus:outline-hidden  disabled:opacity-50 disabled:pointer-events-none'>
                                  <FaEye />
                                </Link>
                                <button
                                  type="button"

                                  className="text-xs font-semibold text-red-700 cursor-pointer  focus:outline-hidden  disabled:opacity-50 disabled:pointer-events-none"><FaRegTrashAlt />

                                </button>
                              </div>

                            </td>
                          </tr>
                        ))}

                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/*PANEL: ADD CANDIDATE */}
              {addCandidateVisible && (
                <div className="flex flex-col items-start justify-start gap-2 bg-white rounded-lg p-4 shadow-lg w-full">
                  <h3 className="text-gray-800 text-md font-black mb-2">
                    Add Candidate
                  </h3>
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
                          className='w-full border p-2 rounded'
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
                        Specialty
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
                      />
                    </div>

                    <div className="flex flex-col w-full">
                      <label className="text-gray-700 p-1 block">
                        Preferred Shift
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
              )}

              {/*PANEL: CALENDAR */}
              {calendarVisible && (
                <div className="flex flex-col items-start justify-start gap-2 bg-white rounded-lg p-4 shadow-lg w-full">
                  <h3 className="text-gray-800 text-md font-black mb-2">
                    My Calendar
                  </h3>
                  <MyCalendar />
                </div>
              )}

              {/*PANEL: SETTINGS */}
              {settingsVisible && (
                <div className="flex flex-col items-start justify-start gap-2 bg-white rounded-lg p-4 shadow-lg w-full">
                  <h3 className="text-gray-800 text-md font-black mb-2">
                    Settings
                  </h3>
                </div>
              )}

            </div>
          </div>


        </section>
      </div>
      <ToastContainer/>
    </div>
  );
}