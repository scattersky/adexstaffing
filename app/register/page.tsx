"use client"
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {auth} from "@/lib/firebase";
import axios from "axios";
import { Steps } from 'primereact/steps';
import { MultiSelect } from "primereact/multiselect";
import Image from "next/image";
import {Slide, toast} from "react-toastify";

interface RegisterFormInputs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  city: string;
  state: string;
  yearsExperience: string;
  role: string;
  specialty: string[];
  degree: string;
  statesLicensure: string[];
  resume: File | null;
  preferredShift: string[];
  preferredLocation: string[];
}

export default function Register() {
  // const [specialtyOptions, setSpecialtyOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [specialtyOptions, setSpecialtyOptions] = useState<any[]>([]);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormInputs>();

  const items = [
    { label: 'Basic Information' },
    { label: 'Work Experience' },
    { label: 'Job Matching' }
  ];
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



  const onSubmit = async (data: any) => {
    setLoading(true);

    try {
      // 1️⃣ Firebase auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const uid = userCredential.user.uid;

      const formData = new FormData();

      formData.append("firebase_uid", uid);
      formData.append("first_name", data.firstName);
      formData.append("last_name", data.lastName);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("city", data.city);
      formData.append("state", data.state);
      formData.append("degree", data.degree);
      formData.append("years_experience", data.yearsExperience);
      formData.append("role", "candidate");

      formData.append("specialty", JSON.stringify(data.specialty));
      formData.append("states_licensure", JSON.stringify(data.statesLicensure));
      formData.append("preferred_shift", JSON.stringify(data.preferredShift));
      formData.append("preferred_location", JSON.stringify(data.preferredLocation));

      if (resumeFile) {
        formData.append("resume", resumeFile);
      }

      await axios.post("https://adextravelnursing.com/api_register_user.php", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success('Account created, Welcome to ADEX!',{
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

    } catch (err: any) {
      console.log(err.message);
      toast.error(err.message,{
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

    setLoading(false);
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-200'>
      <div className="w-1/2 min-h-screen flex flex-col justify-start items-center">
        <div className="flex justify-center items-center mt-12 mb-4 w-full min-w-2xl bg-transparent">
          <Steps
            model={items}
            activeIndex={activeIndex}
            onSelect={(e) => setActiveIndex(e.index)}
            readOnly={false}
            pt={{
              root: { className: "bg-white p-4 rounded-lg shadow w-full max-w-xl" }
            }}
          />
        </div>

        <div className="max-w-xl w-full mx-auto space-y-4 bg-white rounded-md shadow-sm p-8 ">

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {activeIndex === 0 && (
              <div className='flex flex-col gap-4 relative min-h-140'>
                <h3 className='text-gray-600 text-2xl font-bold mb-4'>Basic Information</h3>
                <div className="flex justify-between items-center space-x-2">
                  <div className="w-full">
                    <label htmlFor="firstName" className="block text-md font-bold mb-1 text-gray-700">First Name</label>
                    <input
                      placeholder="First Name"
                      {...register("firstName", { required: "First name is required" })}
                      className="w-full border border-gray-400 p-2 rounded"
                    />
                    {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
                  </div>
                  <div className="w-full">
                    <label htmlFor="lastName" className="block text-md font-bold mb-1 text-gray-700">Last Name</label>
                    <input
                      placeholder="Last Name"
                      {...register("lastName", { required: "Last name is required" })}
                      className="w-full border p-2 rounded border-gray-400"
                    />
                    {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
                    </div>
                  </div>

                <div className="flex justify-between items-center space-x-2">
                  <div className="w-full">
                  <label htmlFor="email" className="block text-md font-bold mb-1 text-gray-700">Email</label>
                  <input
                    type="email"
                    placeholder="Email"
                    {...register("email", { required: "Email is required" })}
                    className="w-full border p-2 rounded border-gray-400"
                  />
                  {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                  </div>

                  <div className="w-full">
                    <label htmlFor="phone" className="block text-md font-bold mb-1 text-gray-700">Phone</label>
                    <input
                      placeholder="Phone"
                      {...register("phone")}
                      className="w-full border p-2 rounded border-gray-400"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center space-x-2">
                  <div className="w-full">
                    <label htmlFor="password" className="block text-md font-bold mb-1 text-gray-700">Password</label>
                    <input
                      type="password"
                      {...register("password", { required: "Password is required", minLength: 6 })}
                      className="w-full border p-2 rounded border-gray-400"
                    />
                    {errors.password && <p className="text-red-500">Password must be at least 6 characters</p>}
                  </div>
                </div>

                <div className="flex justify-between items-center space-x-2">
                  <div className="w-full">
                    <label htmlFor="city" className="block text-md font-bold mb-1 text-gray-700">City</label>
                    <input
                      placeholder="City"
                      {...register("city", { required: "City is required" })}
                      className="w-full border p-2 rounded border-gray-400"
                    />
                    {errors.city && <p className="text-red-500">{errors.city.message}</p>}
                  </div>

                  <div className="w-full">
                    <label htmlFor="state" className="block text-md font-bold mb-1 text-gray-700">State</label>
                    <select
                      {...register("state", { required: "Select state" })}
                      className="w-full border p-2 rounded border-gray-400"
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
                <div className="flex justify-end gap-2 mt-10 absolute bottom-0 right-0">
                  <button
                    disabled={activeIndex === 0}
                    onClick={() => setActiveIndex((prev) => prev - 1)}
                    className="px-4 py-2 bg-gray-300 rounded-md"
                  >
                    Back
                  </button>
                  <button
                    disabled={activeIndex === items.length - 1}
                    onClick={() => setActiveIndex((prev) => prev + 1)}
                    className="px-4 py-2 bg-red-700 text-white rounded-md"
                  >
                    Next
                  </button>
                </div>
              </div>
           )}
            {activeIndex === 1 && (
              <div className='relative min-h-140 flex flex-col gap-4 '>
                <h3 className='text-gray-600 text-2xl font-bold mb-4'>Work Experience</h3>
                {/* Degree Select */}
                <div className="w-full">
                  <label htmlFor="degree" className="block text-md font-bold mb-1 text-gray-700">Degree/Modality</label>
                  <select
                    {...register("degree", { required: "Select degree" })}
                    className="w-full border p-2 rounded border-gray-400"
                  >
                    <option value="">Select Degree...</option>
                    <option value="RN">RN</option>
                    <option value="Allied">Allied Health Professional</option>
                    <option value="Therapy">Therapy</option>
                  </select>
                  {errors.degree && <p className="text-red-500">{errors.degree.message}</p>}
                </div>
                {/* Years Experience Select */}
                <div className="w-full">
                  <label htmlFor="yearsExperience" className="block text-md font-bold mb-1 text-gray-700">Years of Experience</label>
                  <select
                    {...register("yearsExperience", { required: "Select experience level" })}
                    className="w-full border p-2 rounded border-gray-400"
                  >
                    <option value="">Select Years of Experience</option>
                    <option value="0-1 Years">0-1 Years</option>
                    <option value="2-3 Years">2-3 Years</option>
                    <option value="4-5 Years">4-5 Years</option>
                    <option value="6-10 Years">6-10 Years</option>
                    <option value="10+ Years">10+ Years</option>
                  </select>
                  {errors.yearsExperience && <p className="text-red-500">{errors.yearsExperience.message}</p>}
                </div>
                {/* Specialty/Specialties MultiSelect */}
                <div className="w-full">
                  <label htmlFor="specialty" className="block text-md font-bold mb-1 text-gray-700">Specialty/Specialties</label>
                  <Controller
                    name="specialty"
                    control={control}
                    rules={{ required: "Select at least one specialty" }}
                    render={({ field }) => (
                      <MultiSelect
                        {...field}
                        options={specialtyOptions}
                        placeholder="Select Specialties"
                        display="chip"
                        className="w-full border-gray-400"
                        pt={{
                          labelContainer: { className: "text-sm rounded border border-gray-400" }
                        }}
                      />
                    )}
                  />
                  {errors.specialty && <p className="text-red-500">{errors.specialty.message}</p>}
                </div>
                {/* State Licenses MultiSelect */}
                <div className="w-full">
                  <label htmlFor="statesLicensure" className="block text-md font-bold mb-1 text-gray-700">States in which you hold licensure:</label>
                  <Controller
                    name="statesLicensure"
                    control={control}
                    rules={{ required: "Select states in which you hold licensure" }}
                    render={({ field }) => (
                      <MultiSelect
                        {...field}
                        options={stateOptions}
                        placeholder="Select States"
                        display="chip"
                        className="w-full border-gray-400"
                        pt={{
                          labelContainer: { className: "text-sm rounded border border-gray-400" }
                        }}
                      />
                    )}
                  />
                  {errors.statesLicensure && <p className="text-red-500">{errors.statesLicensure.message}</p>}
                </div>
                {/* Resume */}
                <div className="w-full">
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
                    className="border p-2 text-md border-gray-400 w-full rounded bg-white file:bg-gray-400 file:text-white file:py-1 file:px-2 file:rounded-md file:border-0 file:mr-2"
                  />
              </div>
                <div className="flex justify-end gap-2 mt-10 absolute bottom-0 right-0">
                  <button

                    onClick={() => setActiveIndex((prev) => prev - 1)}
                    className="px-4 py-2 bg-gray-300 rounded-md"
                  >
                    Back
                  </button>
                  <button
                    disabled={activeIndex === items.length - 1}
                    onClick={() => setActiveIndex((prev) => prev + 1)}
                    className="px-4 py-2 bg-red-700 text-white rounded-md"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {activeIndex === 2 && (
              <div className='relative min-h-140 flex flex-col gap-4 '>
                <h3 className='text-gray-600 text-2xl font-bold mb-4'>Job Matching</h3>
                {/* Preferred Shift MultiSelect */}
                <div className="w-full">
                  <label htmlFor="preferredShift" className="block text-md font-bold mb-1 text-gray-700">Preferred Shift(s)</label>
                  <Controller
                    name="preferredShift"
                    control={control}
                    rules={{ required: "Select at least one shift." }}
                    render={({ field }) => (
                      <MultiSelect
                        {...field}
                        options={shiftOptions}
                        placeholder="Select one or more shift preferences"
                        display="chip"
                        className="w-full border-gray-400"
                        pt={{
                          labelContainer: { className: "text-sm rounded border border-gray-400" }
                        }}
                      />
                    )}
                  />
                  {errors.preferredShift && <p className="text-red-500">{errors.preferredShift.message}</p>}
                </div>
                {/* Preferred Location MultiSelect */}
                <div className="w-full">
                  <label htmlFor="preferredLocation" className="block text-md font-bold mb-1 text-gray-700">Preferred Location(s)</label>
                  <Controller
                    name="preferredLocation"
                    control={control}
                    rules={{ required: "Select at least one location." }}
                    render={({ field }) => (
                      <MultiSelect
                        {...field}
                        options={stateOptions}
                        placeholder="Select one or more location preferences"
                        display="chip"
                        className="w-full border-gray-400"
                        pt={{
                          labelContainer: { className: "text-sm rounded border border-gray-400" }
                        }}
                      />
                    )}
                  />
                  {errors.preferredLocation && <p className="text-red-500">{errors.preferredLocation.message}</p>}
                </div>
                <div className="flex justify-end gap-2 mt-4 absolute bottom-0 right-0">
                  <button

                    onClick={() => setActiveIndex((prev) => prev - 1)}
                    className="px-4 py-2 bg-gray-300 rounded-md"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="border border-red-700 hover:border-red-600  bg-red-700 rounded-md hover:bg-red-600 duration-700 transition cursor-pointer  text-white px-4 py-2"
                  >
                    {loading ? "Creating Account..." : "Register"}
                  </button>
                </div>
              </div>
            )}



          </form>
        </div>
      </div>
      <div className="w-1/2 flex flex-col justify-center items-center bg-[url('/hero.jpeg')] bg-cover bg-right min-h-screen">

      </div>
    </div>
  );
}