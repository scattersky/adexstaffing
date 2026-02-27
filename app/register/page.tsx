"use client"
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {auth} from "@/lib/firebase";
import axios from "axios";
import { MultiSelect } from "primereact/multiselect";
import Image from "next/image";

interface RegisterFormInputs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  yearsExperience: string;
  specialty: string[];
}

export default function Register() {
  // const [specialtyOptions, setSpecialtyOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const specialtyOptions = [,
    "Burn ICU",
    "CVICU",
    "ICU - Intensive Care Unit",
    "Med Surg",
    "Neuro ICU",
    "Progressive Care Unit",
    "Telemetry",
    "ICU",
    "ER",
    "PACU",
    "Oncology",
    "Cath Lab",
    "Interventional Radiology",
    "Medical Surgical",
    "CVOR",
    "MS/Tele",
    "PICU",
    "PCU",
    "Operating Room",
    "Cardiac Cath Lab",
    "Tele",
    "Case Manager",
    "Cath lab",
    "Medical / Surgical",
    "OR",
    "Med Surg (Medical Surgical)",
    "ICU (Intensive Care Unit)",
    "Case Management",
    "ER (Emergency Room)",
    "OR (Operating Room)",
    "Stepdown",
    "RN - Cath Lab",
    "RN - ICU",
    "RN - PCU",
    "RN - Med Surg",
    "RN - PACU",
    "RN - Infusion",
    "RN - Emergency Dept",
    "RN - Post Partum",
    "RN Medical/Surgical",
    "RN Emergency Room",
    "RN Telemetry",
    "RN ICU",
    "RN PCU",
    "RN Step Down",
    "RN Oncology",
    "RN Cath Lab",
    "OR - Operating Room",
    "NICU",
    "Pediatrics ER",
    "Medical Surgical / Telemetry",
    "Medical-Surgical",
    "Medical - Surgical (Telemetry)",
    "Emergency Room",
    "RN - MedSurg/Tele",
    "RN - Intensive Care Unit",
    "RN - Progressive Care Unit",
    "Pediatrics",
    "GI Lab",
    "Physical Therapist",
    "Occupational Therapist",
    "Speech Language Pathologist",
    "Cath Lab Technologist",
    "Nuclear Medicine Technologist",
    "Ultrasound Technologist",
    "CT Technologist",
    "X-Ray Technologist",
    "Interventional Radiology Technologist",
    "Mammography Technologist",
    "MRI Technologist",
    "Echo Technologist",
    "Cardiovascular Technologist",
    "Dosimetrist",
    "CT Technologist/X-Ray Technologist",
    "Interventional Radiologic Technologist",
    "Electrophysiology Technologist",
    "Radiation Therapist",
    "Registered Respiratory Therapist",
    "CVOR Technologist",
    "Vascular Interventional Technician",
    "Echo-Vascular Technician",
    "Physics Boise",
    "Respiratory Therapist",
    "Radiology Technologist",
    "Certified Surgical Technologist",
    "Ultrasound Technologist/OB",
    "MRI Technologist/Radiology Technologist",
    "Surgical Technologist",
    "Vascular Sonographer",
    "Echo-Vascular Technologist",
    "Special Procedures Technologist",
    "Pediatric Echocardiography",
    "Physical Therapy",
    "Intensive Care Unit (ICU)"
  ]
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormInputs>();

  // Load specialties dynamically
  // useEffect(() => {
  //   axios.get("https://adextravelnursing.com/get_specialties.php")
  //     .then(res => setSpecialtyOptions(res.data));
  // }, []);

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

      // 2️⃣ Store profile in MySQL
      await axios.post("http://localhost/api/register_user.php", {
        firebase_uid: uid,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        specialty: data.specialty,
        years_experience: data.yearsExperience,
      });

      alert("Registration successful!");

    } catch (err: any) {
      alert(err.message);
    }

    setLoading(false);
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-200'>
      <div className="w-1/2 min-h-screen flex flex-col justify-center items-center">
        <div className="max-w-md mx-auto space-y-4 bg-white rounded-md shadow-sm p-5">
          <Image src="/adexlogo.webp" alt="logo" width={200} height={100} className='mx-auto mb-6'/>
          <h2 className="text-xl font-black mb-2 text-gray-800">Create Account</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <input
              placeholder="First Name"
              {...register("firstName", { required: "First name is required" })}
              className="w-full border p-2 rounded"
            />
            {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}

            <input
              placeholder="Last Name"
              {...register("lastName", { required: "Last name is required" })}
              className="w-full border p-2 rounded"
            />
            {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}

            <input
              type="email"
              placeholder="Email"
              {...register("email", { required: "Email is required" })}
              className="w-full border p-2 rounded"
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}

            <input
              type="password"
              placeholder="Password"
              {...register("password", { required: "Password is required", minLength: 6 })}
              className="w-full border p-2 rounded"
            />
            {errors.password && <p className="text-red-500">Password must be at least 6 characters</p>}

            <input
              placeholder="Phone"
              {...register("phone")}
              className="w-full border p-2 rounded"
            />

            {/* Years Experience Select */}
            <select
              {...register("yearsExperience", { required: "Select experience level" })}
              className="w-full border p-2 rounded"
            >
              <option value="">Select Years of Experience</option>
              <option value="0-1 Years">0-1 Years</option>
              <option value="2-3 Years">2-3 Years</option>
              <option value="4-5 Years">4-5 Years</option>
              <option value="6-10 Years">6-10 Years</option>
              <option value="10+ Years">10+ Years</option>
            </select>
            {errors.yearsExperience && <p className="text-red-500">{errors.yearsExperience.message}</p>}

            {/* PrimeReact MultiSelect */}
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
                  className="w-full"
                />
              )}
            />
            {errors.specialty && <p className="text-red-500">{errors.specialty.message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="border border-red-700 hover:border-red-600  bg-red-700 rounded-md hover:bg-red-600 duration-700 transition cursor-pointer  text-white px-4 py-2 w-full"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>

          </form>
        </div>
      </div>
      <div className="w-1/2 flex flex-col justify-center items-center bg-[url('/hero.jpeg')] bg-cover bg-right min-h-screen">

      </div>
    </div>
  );
}