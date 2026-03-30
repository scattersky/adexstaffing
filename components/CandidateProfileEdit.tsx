"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { MultiSelect } from "primereact/multiselect";
import { Slide, toast, ToastContainer } from "react-toastify";

interface CandidateProfile {
  firebase_uid: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  degree: string;
  years_experience: string;
  specialty: string[];
  states_licensure: string[];
  preferred_shift: string[];
  preferred_location: string[];
  resume_url?: string;
}

export default function CandidateProfileEdit() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [specialtyOptions, setSpecialtyOptions] = useState<any[]>([]);

  const stateOptions = [
    { label: "Alabama", value: "AL" }, { label: "Alaska", value: "AK" }, { label: "Arizona", value: "AZ" },
    { label: "Arkansas", value: "AR" }, { label: "California", value: "CA" }, { label: "Colorado", value: "CO" },
    { label: "Connecticut", value: "CT" }, { label: "Delaware", value: "DE" }, { label: "Florida", value: "FL" },
    { label: "Georgia", value: "GA" }, { label: "Hawaii", value: "HI" }, { label: "Idaho", value: "ID" },
    { label: "Illinois", value: "IL" }, { label: "Indiana", value: "IN" }, { label: "Iowa", value: "IA" },
    { label: "Kansas", value: "KS" }, { label: "Kentucky", value: "KY" }, { label: "Louisiana", value: "LA" },
    { label: "Maine", value: "ME" }, { label: "Maryland", value: "MD" }, { label: "Massachusetts", value: "MA" },
    { label: "Michigan", value: "MI" }, { label: "Minnesota", value: "MN" }, { label: "Mississippi", value: "MS" },
    { label: "Missouri", value: "MO" }, { label: "Montana", value: "MT" }, { label: "Nebraska", value: "NE" },
    { label: "Nevada", value: "NV" }, { label: "New Hampshire", value: "NH" }, { label: "New Jersey", value: "NJ" },
    { label: "New Mexico", value: "NM" }, { label: "New York", value: "NY" }, { label: "North Carolina", value: "NC" },
    { label: "North Dakota", value: "ND" }, { label: "Ohio", value: "OH" }, { label: "Oklahoma", value: "OK" },
    { label: "Oregon", value: "OR" }, { label: "Pennsylvania", value: "PA" }, { label: "Rhode Island", value: "RI" },
    { label: "South Carolina", value: "SC" }, { label: "South Dakota", value: "SD" }, { label: "Tennessee", value: "TN" },
    { label: "Texas", value: "TX" }, { label: "Utah", value: "UT" }, { label: "Vermont", value: "VT" },
    { label: "Virginia", value: "VA" }, { label: "Washington", value: "WA" }, { label: "West Virginia", value: "WV" },
    { label: "Wisconsin", value: "WI" }, { label: "Wyoming", value: "WY" }
  ];

  const experienceOptions = [
    { label: "0-1 Years", value: "0-1 Years" },
    { label: "2-3 Years", value: "2-3 Years" },
    { label: "4-5 Years", value: "4-5 Years" },
    { label: "6-10 Years", value: "6-10 Years" },
    { label: "10+ Years", value: "10+ Years" },
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
  useEffect(() => {
    if (!user) return;

    axios.get("https://adextravelnursing.com/api_get_user.php", { params: { uid: user.uid } })
      .then(res => {
        const data = res.data;
        if (!data) return;

        setProfile({
          firebase_uid: user.uid,
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          phone: data.phone || "",
          city: data.city || "",
          state: data.state || "",
          degree: data.degree || "",
          years_experience: data.years_experience || "",
          specialty: JSON.parse(data.specialty ?? "[]"),
          states_licensure: JSON.parse(data.states_licensure ?? "[]"),
          preferred_shift: JSON.parse(data.preferred_shift ?? "[]"),
          preferred_location: JSON.parse(data.preferred_location ?? "[]"),
          resume_url: data.resume_url || ""
        });
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(profile).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      if (resumeFile) formData.append("resume", resumeFile);

      const res = await axios.post(
        "https://adextravelnursing.com/api_candidate_profile_edit.php",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data?.success) {
        toast.success("Profile updated successfully!", { position: "bottom-right", autoClose: 3000, theme: "colored", transition: Slide });
      } else {
        toast.error(res.data?.error || "Unable to update profile.", { position: "bottom-right", autoClose: 3000, theme: "colored", transition: Slide });
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.", { position: "bottom-right", autoClose: 3000, theme: "colored", transition: Slide });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) return <p>Loading...</p>;
  if (!profile) return <p>No profile found.</p>;

  return (
    <div className="max-w-3xl p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Your Profile</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <div className="flex gap-4">
          <input type="text" value={profile.first_name} onChange={e => setProfile({...profile, first_name: e.target.value})} placeholder="First Name" className="border p-2 rounded w-full" />
          <input type="text" value={profile.last_name} onChange={e => setProfile({...profile, last_name: e.target.value})} placeholder="Last Name" className="border p-2 rounded w-full" />
        </div>
        <div className="flex gap-4">
          <input type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} placeholder="Email" className="border p-2 rounded w-full" />
          <input type="text" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} placeholder="Phone" className="border p-2 rounded w-full" />
        </div>
        <div className="flex gap-4">
          <input type="text" value={profile.city} onChange={e => setProfile({...profile, city: e.target.value})} placeholder="City" className="border p-2 rounded w-full" />
          <select value={profile.state} onChange={e => setProfile({...profile, state: e.target.value})} className="border p-2 rounded w-full">
            <option value="">Select State</option>
            {stateOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div className="flex gap-4">
          <select value={profile.degree} onChange={e => setProfile({...profile, degree: e.target.value})} className="border p-2 rounded w-full">
            <option value="">Degree/Modality</option>
            <option value="RN">RN</option>
            <option value="Allied">Allied Health Professional</option>
            <option value="Therapy">Therapy</option>
          </select>
          <select value={profile.years_experience} onChange={e => setProfile({...profile, years_experience: e.target.value})} className="border p-2 rounded w-full">
            <option value="">Years of Experience</option>
            {experienceOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>

        <div>
          <label>Specialty</label>
          <MultiSelect value={profile.specialty} options={specialtyOptions} onChange={e => setProfile({...profile, specialty: e.value})} placeholder="Select specialties" className="w-full" display="chip" />
        </div>

        <div>
          <label>States Licensure</label>
          <MultiSelect value={profile.states_licensure} options={stateOptions} onChange={e => setProfile({...profile, states_licensure: e.value})} placeholder="Select states" className="w-full" display="chip" />
        </div>

        <div>
          <label>Preferred Shift(s)</label>
          <MultiSelect value={profile.preferred_shift} options={["Days","Nights","Weekends","Rotating","Flex"].map(v => ({label:v,value:v}))} onChange={e => setProfile({...profile, preferred_shift: e.value})} placeholder="Select shifts" className="w-full" display="chip" />
        </div>

        <div>
          <label>Preferred Location(s)</label>
          <MultiSelect value={profile.preferred_location} options={stateOptions} onChange={e => setProfile({...profile, preferred_location: e.value})} placeholder="Select locations" className="w-full" display="chip" />
        </div>

        <div>
          <label>Resume Upload</label>
          <input type="file" onChange={e => setResumeFile(e.target.files?.[0] || null)} className="border p-2 text-md border-gray-400 w-full rounded bg-white file:bg-gray-400 file:text-white file:py-1 file:px-2 file:rounded-md file:border-0 file:mr-2" />
          {profile.resume_url && (
            <p className="text-xs mt-1">Existing resume: <a href={'https://adextravelnursing.com/'+profile.resume_url} target="_blank" className="text-red-700 underline">View</a></p>
          )}
        </div>

        <button type="submit" disabled={saving} className="bg-red-700 text-white px-4 py-2 rounded-md">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
      <ToastContainer/>
    </div>
  );
}