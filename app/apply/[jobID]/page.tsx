'use client'
import {useEffect, useState} from "react";
import axios from "axios";
import {useAuth} from "@/context/AuthContext";
import {useParams} from "next/navigation";
import InnerPageTitle from "@/app/sections/InnerPageTitle";
import moment from "moment";
import {MultiSelect} from "primereact/multiselect";
import {Slide, toast, ToastContainer} from "react-toastify";

interface UserProfile {
  id: number;
  firebase_uid: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  specialty: string;
  years_experience: string;
  resume_url?: string;
  states_licensure?: string | string[];
}

interface ApplyFormInputs {
  firebase_uid: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  years_experience: string;
  states_licensure: string[];
  resume_url: string;
  additional_files_urls: string[];
  referrer_name: string;
}

const APPLY_API_URL =
  process.env.NEXT_PUBLIC_APPLY_API_URL ||
  "https://adextravelnursing.com/api_submit_application.php";

export default function ApplyNowPage() {
  const { user, loading: authLoading } = useAuth();
  const params = useParams();
  const jobID = Array.isArray(params?.jobID) ? params.jobID[0] : params?.jobID;

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const [applyForm, setApplyForm] = useState<ApplyFormInputs>({
    firebase_uid: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    years_experience: "",
    states_licensure: [],
    resume_url: "",
    additional_files_urls: [],
    referrer_name: ""
  });

  useEffect(() => {
    if (!user) return;

    axios
      .get("https://adextravelnursing.com/api_get_user.php", {
        params: { uid: user.uid }
      })
      .then((response) => {
        const profile = response.data as UserProfile;
        const parsedStates = Array.isArray(profile.states_licensure)
          ? profile.states_licensure
          : typeof profile.states_licensure === "string" && profile.states_licensure.trim() !== ""
            ? profile.states_licensure.split(",").map((state) => state.trim()).filter(Boolean)
            : [];

        setApplyForm((prev) => ({
          ...prev,
          firebase_uid: user.uid,
          first_name: profile.first_name || "",
          last_name: profile.last_name || "",
          email: profile.email || "",
          phone: profile.phone || "",
          years_experience: profile.years_experience || "",
          resume_url: profile.resume_url || "",
          states_licensure: parsedStates
        }));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);

  useEffect(() => {
    if (!jobID) return;

    axios
      .get("https://adextravelnursing.com/api_get_single_job.php", {
        params: { job_id: jobID }
      })
      .then((res) => {
        setJob(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [jobID]);

  const experienceOptions = [
    {label: "0-1 Years", value: "0-1 Years"},
    {label: "2-3 Years", value: "2-3 Years"},
    {label: "4-5 Years", value: "4-5 Years"},
    {label: "6-10 Years", value: "6-10 Years"},
    {label: "10+ Years", value: "10+ Years"},
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    if (!jobID) {
      setSubmitError("Missing job ID.");
      return;
    }

    if (!applyForm.first_name || !applyForm.last_name || !applyForm.email || !applyForm.phone || !applyForm.years_experience) {
      setSubmitError("Please complete all required fields.");
      return;
    }

    if (!resumeFile && !applyForm.resume_url) {
      setSubmitError("Please upload a resume.");
      return;
    }

    setFormLoading(true);
    try {
      const formData = new FormData();
      formData.append("firebase_uid", applyForm.firebase_uid || user?.uid || "");
      formData.append("job_id", String(jobID));
      formData.append("job_title", job?.job_title || "");
      formData.append("job_city", job?.job_city || "");
      formData.append("job_state", job?.job_state || "");
      formData.append("first_name", applyForm.first_name);
      formData.append("last_name", applyForm.last_name);
      formData.append("email", applyForm.email);
      formData.append("phone", applyForm.phone);
      formData.append("years_experience", applyForm.years_experience);
      formData.append("states_licensure_csv", applyForm.states_licensure.join(","));
      formData.append("referrer_name", applyForm.referrer_name);
      formData.append("resume_url", applyForm.resume_url || "");
      formData.append("additional_files_urls", JSON.stringify(applyForm.additional_files_urls || []));

      if (resumeFile) {
        formData.append("resume_file", resumeFile);
      }

      const res = await axios.post(APPLY_API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if (res.data?.success || res.data?.status === "success") {
        // setSubmitSuccess("Application submitted successfully.");
        toast.success('Application submitted successfully!',{
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
        setApplyForm((prev) => ({
          ...prev,
          years_experience: "",
          states_licensure: [],
          additional_files_urls: [],
          referrer_name: "",
          resume_url: res.data?.resume_url || prev.resume_url
        }));
        setResumeFile(null);
      } else {
        setSubmitError(res.data?.message || "Unable to submit application.");
      }
    } catch (err: any) {
      setSubmitError(err?.response?.data?.message || "Something went wrong while submitting.");
    } finally {
      setFormLoading(false);
    }
  };

  if (authLoading || loading ) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-red-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <InnerPageTitle title='Apply Now' />
      <div className="bg-gray-100 pt-2 pb-12">
        <section className="mt-12 max-w-7xl mx-auto md:px-8 min-h-screen">
          <div className="flex justify-between items-start gap-4 flex-wrap md:flex-nowrap px-4 md:px-0">
            <div className="flex flex-col items-start justify-start gap-2 w-full md:w-[25%] h-screen" >
              <div className="flex flex-col items-start justify-start gap-1 bg-white rounded-lg p-4 shadow w-full sticky top-4">
                <div className="flex justify-center items-center px-2 pt-1 pb-1.5 w-35 rounded-md bg-sky-800 -ml-0.5 mb-1">
                  <span className="text-white text-[11px] leading-3 mt-1  font-medium uppercase tracking-widest">APPLYING FOR:</span>
                </div>

                <div className='space-y-2 pb-2'>
                  <h3 className="text-gray-700 text-xl font-black mb-2">{job?.job_title}</h3>
                  <hr className='bg-black w-full h-0.5 mb-3 opacity-20'/>
                  <div className='flex items-center justify-start text-sm text-gray-600'>
                    <p className=' text-sm'><span className='font-bold  text-sm'>Posted: </span>{job?.job_posted ? moment(job.job_posted).format('MMMM Do YYYY') : "-"}</p>
                  </div>
                  <div className='flex items-center justify-start text-sm text-gray-600'>
                    <p className=' text-sm'><span className='font-bold  text-sm'>Location: </span>{job?.job_city}, {job?.job_state}</p>
                  </div>
                  <div className='flex items-center justify-start text-sm text-gray-600'>
                    <p className=' text-sm'><span className='font-bold  text-sm'>Degree: </span>{job?.job_degree}</p>
                  </div>
                  <div className='flex items-center justify-start text-sm text-gray-600'>
                    <p className=' text-sm'><span className='font-bold  text-sm'>Specialty: </span>{job?.job_specialty}</p>
                  </div>
                  <div className='flex items-center justify-start text-sm text-gray-600'>
                    <p className=' text-sm'><span className='font-bold  text-sm'>Shift: </span>{job?.job_shift}</p>
                  </div>
                  <div className='flex items-center justify-start text-sm text-gray-600'>
                    <p className=' text-sm'><span className='font-bold  text-sm'>Weekly Pay: </span>${job?.job_weekly_pay}</p>
                  </div>
                  <div className='flex items-center justify-start text-sm text-gray-600'>
                    <p className=' text-sm'><span className='font-bold  text-sm'>Duration: </span>{job?.job_priority}</p>
                  </div>
                  <div className='flex items-center justify-start text-sm text-gray-600'>
                    <p className=' text-sm'><span className='font-bold  text-sm'>VMS ID: </span>{job?.job_vms_id}</p>
                  </div>
                  <div className='flex items-center justify-start text-sm text-gray-600'>
                    <p className=' text-sm'><span className='font-bold  text-sm'>Job ID: </span>{job?.job_id}</p>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col items-start justify-between gap-2 bg-white rounded-lg p-6 shadow w-full md:w-[75%] h-full">
              <p className='text-sm mb-4'><i>Form fields pre-populated for your convenience, change info as needed or update your candidate profile in the dashboard.</i></p>
              {submitSuccess ? (
                <div className="w-full bg-green-100 text-green-800 border border-green-200 rounded p-3 text-sm">
                  {submitSuccess}
                </div>
              ) : null}

              {submitError ? (
                <div className="w-full bg-red-100 text-red-800 border border-red-200 rounded p-3 text-sm">
                  {submitError}
                </div>
              ) : null}

              <div className='flex flex-row items-center justify-between w-full gap-6 mb-2'>

                <div className="flex flex-col items-start justify-start gap-0 w-full">
                  <label htmlFor="first_name" className="block text-md font-bold mb-1 text-gray-700">First Name</label>
                  <input
                    id="first_name"
                    type="text"
                    name="first_name"
                    required
                    value={applyForm.first_name}
                    onChange={(e) =>
                      setApplyForm({ ...applyForm, first_name: e.target.value })
                    }
                    className="border p-3 border-gray-300 w-full rounded"
                  />
                </div>
                <div className="flex flex-col items-start justify-start gap-0 w-full">
                  <label htmlFor="last_name" className="block text-md font-bold mb-1 text-gray-700">Last Name</label>
                  <input
                    id="last_name"
                    type="text"
                    name="last_name"
                    required
                    value={applyForm.last_name}
                    onChange={(e) =>
                      setApplyForm({ ...applyForm, last_name: e.target.value })
                    }
                    className="border p-3 border-gray-300 w-full rounded"
                  />
                </div>
              </div>

              <div className='flex flex-row items-center justify-between w-full gap-6 mb-2'>
                <div className="flex flex-col items-start justify-start gap-0 w-full">
                  <label htmlFor="email" className="block text-md font-bold mb-1 text-gray-700">Email</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    value={applyForm.email}
                    onChange={(e) =>
                      setApplyForm({ ...applyForm, email: e.target.value })
                    }
                    className="border p-3 border-gray-300 w-full rounded"
                  />
                </div>
                <div className="flex flex-col items-start justify-start gap-0 w-full">
                  <label htmlFor="phone" className="block text-md font-bold mb-1 text-gray-700">Phone</label>
                  <input
                    id="phone"
                    type="text"
                    name="phone"
                    required
                    value={applyForm.phone}
                    onChange={(e) =>
                      setApplyForm({ ...applyForm, phone: e.target.value })
                    }
                    className="border p-3 border-gray-300 w-full rounded"
                  />
                </div>
              </div>

              <div className='flex flex-row items-center justify-between w-full gap-6 mb-2'>
                <div className="flex flex-col items-start justify-start gap-0 w-full">
                  <label htmlFor="years_experience" className="block text-md font-bold mb-1 text-gray-700">Years of Experience</label>
                  <select
                    id="years_experience"
                    name="years_experience"
                    required
                    value={applyForm.years_experience}
                    onChange={(e) => setApplyForm({ ...applyForm, years_experience: e.target.value })}
                    className="border p-3 border-gray-300 w-full rounded bg-white"
                  >
                    <option value="">Select...</option>
                    {experienceOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col items-start justify-start gap-0 w-full"></div>
              </div>

              <div className='flex flex-row items-center justify-between w-full gap-6 mb-2'>
                <div className="flex flex-col items-start justify-start gap-0 w-full">
                  <label htmlFor="states_licensure" className="block text-md font-bold mb-1 text-gray-700">States of Licensure</label>
                  <MultiSelect
                    value={applyForm.states_licensure}
                    options={stateOptions}
                    onChange={(e) =>
                      setApplyForm({ ...applyForm, states_licensure: e.value })
                    }
                    placeholder="Select States"
                    className="w-full p-1"
                    display="chip"
                    filter
                    showClear
                  />
                </div>
              </div>

              <div className='flex flex-row items-center justify-between w-full gap-6 mb-2'>
                <div className="flex flex-col items-start justify-start gap-0 w-full">
                  <label htmlFor="resume_file" className="block text-md font-bold mb-1 text-gray-700">Resume Upload</label>
                  <input
                    id="resume_file"
                    type="file"
                    name="resume_file"
                    accept=".pdf,.doc,.docx,.rtf,.txt"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setResumeFile(file);
                    }}
                    className="border p-2 border-gray-300 w-full rounded bg-white file:bg-gray-400 file:text-white file:py-1 file:px-2 file:rounded-md file:border-0 file:mr-2"
                  />
                  {applyForm.resume_url ? (
                    <p className="text-xs text-gray-500 mt-1">
                      Existing resume on file. Uploading a new file will replace it for this application. <a href={applyForm.resume_url} target="_blank" rel="noopener noreferrer" className="text-red-700 hover:underline">View Resume</a>
                    </p>
                  ) : null}
                </div>
              </div>

              <div className='flex flex-row items-center justify-between w-full gap-6 mb-2'>
                <div className="flex flex-col items-start justify-start gap-0 w-full">
                  <label htmlFor="referrer_name" className="block text-md font-bold mb-1 text-gray-700">Referrer Name</label>
                  <input
                    id="referrer_name"
                    type="text"
                    name="referrer_name"
                    value={applyForm.referrer_name}
                    onChange={(e) =>
                      setApplyForm({ ...applyForm, referrer_name: e.target.value })
                    }
                    className="border p-3 border-gray-300 w-full rounded"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="border border-red-700 hover:border-red-600 bg-red-700 rounded-md hover:bg-red-600 duration-700 transition cursor-pointer text-white px-4 mt-4 py-2 w-full disabled:opacity-70 max-w-60"
              >
                {formLoading ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </div>
        </section>
      </div>
      <ToastContainer/>
    </div>
  );
}
